import {
    IExecuteFunctions,
    ILoadOptionsFunctions,
    IDataObject,
    NodeApiError,
    IHttpRequestOptions,
    IHttpRequestMethods,
    JsonObject,
} from 'n8n-workflow';

const BASE = 'https://api.supermetrics.com/enterprise/v2';
const CACHE_DEFAULT_TTL_SECONDS = 3600;

/**
 * Low-level request helper that ensures auth and sensible defaults.
 * Uses the credentials' automatic Authorization header binding.
 * Includes optional caching (in-memory).
 *
 * To control caching per request, you may pass these optional flags via `options`:
 *   (options as any).skipCache  -> boolean (default false)
 *   (options as any).cacheTTL   -> number (seconds)
 *   (options as any).cacheKey   -> string (override auto key)
 */
export async function supermetricsRequest(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpointOrFullUrl: string,
    body: IDataObject = {},
    qs: IDataObject = {},
    options: Partial<IHttpRequestOptions> = {},
): Promise<any> {
    const isFullUrl = /^https?:\/\//i.test(endpointOrFullUrl);
    const url = isFullUrl ? endpointOrFullUrl : `${BASE}${endpointOrFullUrl}`;

    // Cache controls (opt-in via options)
    const optAny = options as any;
    const skipCache: boolean = Boolean(optAny?.skipCache);
    const cacheTTL: number = 1000 * (typeof optAny?.cacheTTL === 'number' ? optAny.cacheTTL : CACHE_DEFAULT_TTL_SECONDS);
    const cacheKeyOverride: string | undefined = optAny?.cacheKey as string | undefined;

    const key = makeCacheKey(method, url, body, qs, cacheKeyOverride);
    if (!skipCache) {
        const cached = cacheGet(key);
        if (cached !== undefined) return cached;
    }

    const requestOptions: IHttpRequestOptions = {
        method,
        url,
        json: true,
        qs,
        body,
        ...options,
    };

    const maxRetries = Number.isInteger(optAny?.retries) ? Math.max(0, optAny.retries) : 2;
    const baseDelayMs = Number.isInteger(optAny?.retryDelayMs) ? Math.max(50, optAny.retryDelayMs) : 250;

    let attempt = 0;
    while (true) {
        let response: any;
        try {
            // @ts-ignore - httpRequestWithAuthentication available at runtime
            response = await this.helpers.httpRequestWithAuthentication.call(
                this,
                'supermetricsApi',
                requestOptions,
            );
        } catch (error: unknown) {
            const err = error as any;

            // Extract best-effort status code & retry-after
            const status = err?.httpCode ?? err?.statusCode;
            const retryAfterHeader = err?.response?.headers?.['retry-after'] ?? err?.response?.headers?.['Retry-After'];
            const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : undefined;

            // Retry on transient errors with jitter + Retry-After
            const transient = status === 429 || (status >= 500 && status < 600);
            if (transient && attempt < maxRetries) {
                const jitter = Math.floor(Math.random() * 100);
                const delay = retryAfterMs ?? (baseDelayMs * Math.pow(2, attempt) + jitter);
                await new Promise((r) => setTimeout(r, delay));
                attempt++;
                continue;
            }

            // Fall through to error normalization below
            const errorInfo =
                err?.context?.data?.error ??
                err?.response?.body?.error ??
                err?.error ??
                err;

            throw new NodeApiError(this.getNode(), errorInfo as JsonObject, {
                message:
                    'Supermetrics request error: ' +
                    (errorInfo.description || errorInfo.message || errorInfo.code || ''),
            });
        }

        // http 200 but response contains error
        if (response?.error) {
            const errorInfo = response.error;
            throw new NodeApiError(this.getNode(), response as JsonObject, {
                message:
                    'Supermetrics query error: ' +
                    (errorInfo.description || errorInfo.message || errorInfo.code || ''),
            });
        }

        if (!skipCache) cacheSet(key, response, cacheTTL);
        return response;
    }
}


/**
 * GET with ?json=<payload> convention used across Supermetrics API (v2).
 * For endpoints like /query/fields, /query/accounts, /query/status, /query/results
 */
export async function supermetricsGetRequest(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    endpoint: string,
    payload: IDataObject = {},
    options: Partial<IHttpRequestOptions> = {},
): Promise<any> {
    const qs: IDataObject = {};
    if (Object.keys(payload).length) {
        qs.json = stableStringify(payload);
    }
    return supermetricsRequest.call(this, 'GET', endpoint, {}, qs, options);
}


/**
 * POST JSON body (preferred for /query/data/json to avoid long querystrings)
 */
export async function supermetricsPostRequest(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    endpoint: string,
    payload: IDataObject = {},
    options: Partial<IHttpRequestOptions> = {},
): Promise<any> {
    return supermetricsRequest.call(this, 'POST', endpoint, payload, {}, options);
}

/**
 * Map default JSON result to an array of flat objects, using meta.query.fields[].data_column.
 * NOTE: Only fields split by row are supported for mapping. If a field has no data_column,
 * it’s likely split by column (pivoted) and isn’t mapped here.
 */
export function mapDefaultJsonRowsToItems(apiResponse: any): IDataObject[] {
    const items: IDataObject[] = [];

    if (!apiResponse?.data || !Array.isArray(apiResponse.data)) return items;

    const fields = apiResponse?.meta?.query?.fields ?? [];
    const indexToKey: string[] = [];
    for (const f of fields) {
        if (typeof f?.data_column === 'number') {
            // prefer requested id; fall back to internal field_id
            indexToKey[f.data_column] = f?.field_name ??  f?.id ?? f?.field_id ?? `col_${f.data_column}`;
        }
    }

    for (const row of apiResponse.data as any[]) {
        const obj: IDataObject = {};
        for (let i = 0; i < row.length; i++) {
            const key = indexToKey[i] ?? `col_${i}`;
            obj[key] = row[i];
        }
        items.push(obj);
    }
    return items;
}


// ----------------------
// Simple in-memory cache
// ----------------------
type CacheEntry = { value: any; expires: number };
const CACHE: Record<string, CacheEntry> = {};
const CACHE_MAX_ENTRIES = 500;

function stableStringify(obj: any): string {
    if (!obj || typeof obj !== 'object') return JSON.stringify(obj);
    const keys = Object.keys(obj).sort();
    const sorted: any = {};
    for (const k of keys) sorted[k] = obj[k];
    return JSON.stringify(sorted);
}

function makeCacheKey(method: string, url: string, body: any, qs: any, override?: string): string {
    if (override) return override;
    return `${method} ${url} | qs=${stableStringify(qs)} | body=${stableStringify(body)}`;
}

function cacheGet(key: string): any | undefined {
    const entry = CACHE[key];
    if (!entry) return undefined;
    if (Date.now() > entry.expires) {
        delete CACHE[key];
        return undefined;
    }
    return entry.value;
}

function cacheSet(key: string, value: any, ttlMs: number) {

    if (!Number.isFinite(ttlMs) || ttlMs <= 0) return;

    const keys = Object.keys(CACHE);
    if (keys.length >= CACHE_MAX_ENTRIES) {
        delete CACHE[keys[0]];
    }
    CACHE[key] = {value, expires: Date.now() + ttlMs};
}

