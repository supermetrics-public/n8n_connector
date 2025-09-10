"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supermetricsRequest = supermetricsRequest;
exports.supermetricsGetRequest = supermetricsGetRequest;
exports.supermetricsPostRequest = supermetricsPostRequest;
exports.mapDefaultJsonRowsToItems = mapDefaultJsonRowsToItems;
const n8n_workflow_1 = require("n8n-workflow");
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
async function supermetricsRequest(method, endpointOrFullUrl, body = {}, qs = {}, options = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const isFullUrl = /^https?:\/\//i.test(endpointOrFullUrl);
    const url = isFullUrl ? endpointOrFullUrl : `${BASE}${endpointOrFullUrl}`;
    // Cache controls (opt-in via options)
    const optAny = options;
    const skipCache = Boolean(optAny === null || optAny === void 0 ? void 0 : optAny.skipCache);
    const cacheTTL = 1000 * (typeof (optAny === null || optAny === void 0 ? void 0 : optAny.cacheTTL) === 'number' ? optAny.cacheTTL : CACHE_DEFAULT_TTL_SECONDS);
    const cacheKeyOverride = optAny === null || optAny === void 0 ? void 0 : optAny.cacheKey;
    const key = makeCacheKey(method, url, body, qs, cacheKeyOverride);
    if (!skipCache) {
        const cached = cacheGet(key);
        if (cached !== undefined)
            return cached;
    }
    const requestOptions = {
        method,
        url,
        json: true,
        qs,
        body,
        ...options,
    };
    const maxRetries = Number.isInteger(optAny === null || optAny === void 0 ? void 0 : optAny.retries) ? Math.max(0, optAny.retries) : 2;
    const baseDelayMs = Number.isInteger(optAny === null || optAny === void 0 ? void 0 : optAny.retryDelayMs) ? Math.max(50, optAny.retryDelayMs) : 250;
    let attempt = 0;
    while (true) {
        let response;
        try {
            // @ts-ignore - httpRequestWithAuthentication available at runtime
            response = await this.helpers.httpRequestWithAuthentication.call(this, 'supermetricsApi', requestOptions);
        }
        catch (error) {
            const err = error;
            // Extract best-effort status code & retry-after
            const status = (_a = err === null || err === void 0 ? void 0 : err.httpCode) !== null && _a !== void 0 ? _a : err === null || err === void 0 ? void 0 : err.statusCode;
            const retryAfterHeader = (_d = (_c = (_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.headers) === null || _c === void 0 ? void 0 : _c['retry-after']) !== null && _d !== void 0 ? _d : (_f = (_e = err === null || err === void 0 ? void 0 : err.response) === null || _e === void 0 ? void 0 : _e.headers) === null || _f === void 0 ? void 0 : _f['Retry-After'];
            const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : undefined;
            // Retry on transient errors with jitter + Retry-After
            const transient = status === 429 || (status >= 500 && status < 600);
            if (transient && attempt < maxRetries) {
                const jitter = Math.floor(Math.random() * 100);
                const delay = retryAfterMs !== null && retryAfterMs !== void 0 ? retryAfterMs : (baseDelayMs * Math.pow(2, attempt) + jitter);
                await new Promise((r) => setTimeout(r, delay));
                attempt++;
                continue;
            }
            // Fall through to error normalization below
            const errorInfo = (_o = (_m = (_j = (_h = (_g = err === null || err === void 0 ? void 0 : err.context) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.error) !== null && _j !== void 0 ? _j : (_l = (_k = err === null || err === void 0 ? void 0 : err.response) === null || _k === void 0 ? void 0 : _k.body) === null || _l === void 0 ? void 0 : _l.error) !== null && _m !== void 0 ? _m : err === null || err === void 0 ? void 0 : err.error) !== null && _o !== void 0 ? _o : err;
            throw new n8n_workflow_1.NodeApiError(this.getNode(), errorInfo, {
                message: 'Supermetrics request error: ' +
                    (errorInfo.description || errorInfo.message || errorInfo.code || ''),
            });
        }
        // http 200 but response contains error
        if (response === null || response === void 0 ? void 0 : response.error) {
            const errorInfo = response.error;
            throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                message: 'Supermetrics query error: ' +
                    (errorInfo.description || errorInfo.message || errorInfo.code || ''),
            });
        }
        if (!skipCache)
            cacheSet(key, response, cacheTTL);
        return response;
    }
}
/**
 * GET with ?json=<payload> convention used across Supermetrics API (v2).
 * For endpoints like /query/fields, /query/accounts, /query/status, /query/results
 */
async function supermetricsGetRequest(endpoint, payload = {}, options = {}) {
    const qs = {};
    if (Object.keys(payload).length) {
        qs.json = stableStringify(payload);
    }
    return supermetricsRequest.call(this, 'GET', endpoint, {}, qs, options);
}
/**
 * POST JSON body (preferred for /query/data/json to avoid long querystrings)
 */
async function supermetricsPostRequest(endpoint, payload = {}, options = {}) {
    return supermetricsRequest.call(this, 'POST', endpoint, payload, {}, options);
}
/**
 * Map default JSON result to an array of flat objects, using meta.query.fields[].data_column.
 * NOTE: Only fields split by row are supported for mapping. If a field has no data_column,
 * it’s likely split by column (pivoted) and isn’t mapped here.
 */
function mapDefaultJsonRowsToItems(apiResponse) {
    var _a, _b, _c, _d, _e, _f, _g;
    const items = [];
    if (!(apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.data) || !Array.isArray(apiResponse.data))
        return items;
    const fields = (_c = (_b = (_a = apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.meta) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b.fields) !== null && _c !== void 0 ? _c : [];
    const indexToKey = [];
    for (const f of fields) {
        if (typeof (f === null || f === void 0 ? void 0 : f.data_column) === 'number') {
            // prefer requested id; fall back to internal field_id
            indexToKey[f.data_column] = (_f = (_e = (_d = f === null || f === void 0 ? void 0 : f.field_name) !== null && _d !== void 0 ? _d : f === null || f === void 0 ? void 0 : f.id) !== null && _e !== void 0 ? _e : f === null || f === void 0 ? void 0 : f.field_id) !== null && _f !== void 0 ? _f : `col_${f.data_column}`;
        }
    }
    for (const row of apiResponse.data) {
        const obj = {};
        for (let i = 0; i < row.length; i++) {
            const key = (_g = indexToKey[i]) !== null && _g !== void 0 ? _g : `col_${i}`;
            obj[key] = row[i];
        }
        items.push(obj);
    }
    return items;
}
const CACHE = {};
const CACHE_MAX_ENTRIES = 500;
function stableStringify(obj) {
    if (!obj || typeof obj !== 'object')
        return JSON.stringify(obj);
    const keys = Object.keys(obj).sort();
    const sorted = {};
    for (const k of keys)
        sorted[k] = obj[k];
    return JSON.stringify(sorted);
}
function makeCacheKey(method, url, body, qs, override) {
    if (override)
        return override;
    return `${method} ${url} | qs=${stableStringify(qs)} | body=${stableStringify(body)}`;
}
function cacheGet(key) {
    const entry = CACHE[key];
    if (!entry)
        return undefined;
    if (Date.now() > entry.expires) {
        delete CACHE[key];
        return undefined;
    }
    return entry.value;
}
function cacheSet(key, value, ttlMs) {
    if (!Number.isFinite(ttlMs) || ttlMs <= 0)
        return;
    const keys = Object.keys(CACHE);
    if (keys.length >= CACHE_MAX_ENTRIES) {
        delete CACHE[keys[0]];
    }
    CACHE[key] = { value, expires: Date.now() + ttlMs };
}
