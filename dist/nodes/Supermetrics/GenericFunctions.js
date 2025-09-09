"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supermetricsRequest = supermetricsRequest;
exports.supermetricsGetRequest = supermetricsGetRequest;
exports.supermetricsPostRequest = supermetricsPostRequest;
exports.mapDefaultJsonRowsToItems = mapDefaultJsonRowsToItems;
exports.buildDateRangeParam = buildDateRangeParam;
const n8n_workflow_1 = require("n8n-workflow");
const BASE = 'https://api.supermetrics.com/enterprise/v2';
const CACHE = {};
const DEFAULT_TTL = 1000 * 60 * 15;
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
function cacheSet(key, value, ttl) {
    CACHE[key] = { value, expires: Date.now() + ttl };
}
/**
 * Low-level request helper that ensures auth and sensible defaults.
 * Uses the credentials' automatic Authorization header binding.
 * Now includes optional caching (in-memory).
 *
 * To control caching per request, you may pass these optional flags via `options`:
 *   (options as any).skipCache  -> boolean (default false)
 *   (options as any).cacheTTL   -> number (ms) (default 300000)
 *   (options as any).cacheKey   -> string (override auto key)
 */
async function supermetricsRequest(method, endpointOrFullUrl, body = {}, qs = {}, options = {}) {
    var _a, _b, _c, _d, _e, _f, _g;
    const isFullUrl = /^https?:\/\//i.test(endpointOrFullUrl);
    const url = isFullUrl ? endpointOrFullUrl : `${BASE}${endpointOrFullUrl}`;
    // Cache controls (opt-in via options)
    const optAny = options;
    const skipCache = Boolean(optAny === null || optAny === void 0 ? void 0 : optAny.skipCache);
    const cacheTTL = typeof (optAny === null || optAny === void 0 ? void 0 : optAny.cacheTTL) === 'number' ? optAny.cacheTTL : DEFAULT_TTL;
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
    let response;
    /* throw new NodeApiError(this.getNode(), {error: "err1", message: "err2", description: "err3"},
         { message: "err4", description: "err5"});*/
    try {
        // Use the auth-aware helper so our credential's `authenticate` runs
        // @ts-ignore - httpRequestWithAuthentication available at runtime
        response = await this.helpers.httpRequestWithAuthentication.call(this, 'supermetricsApi', requestOptions);
    }
    catch (error) {
        const err = error;
        // Try to find Supermetrics error payload
        const errorInfo = (_g = (_f = (_c = (_b = (_a = err === null || err === void 0 ? void 0 : err.context) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) !== null && _c !== void 0 ? _c : (_e = (_d = err === null || err === void 0 ? void 0 : err.response) === null || _d === void 0 ? void 0 : _d.body) === null || _e === void 0 ? void 0 : _e.error) !== null && _f !== void 0 ? _f : err === null || err === void 0 ? void 0 : err.error) !== null && _g !== void 0 ? _g : err; // Fallback
        throw new n8n_workflow_1.NodeApiError(this.getNode(), errorInfo, {
            message: 'Supermetrics request error: ' + (errorInfo.description || errorInfo.message || errorInfo.code || '')
        });
    }
    // 👇 detect Supermetrics errors even on HTTP 200
    if (response.error) {
        const errorInfo = response.error;
        // Supermetrics uses { error: { code, message, description } }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
            message: 'Supermetrics query error: ' + (errorInfo.description || errorInfo.message || errorInfo.code || ''),
        });
    }
    if (!skipCache)
        cacheSet(key, response, cacheTTL);
    return response;
}
/**
 * GET with ?json=<payload> convention used across Supermetrics API (v2).
 * For endpoints like /query/fields, /query/accounts, /query/status, /query/results
 */
async function supermetricsGetRequest(endpoint, payload = {}, options = {}) {
    const qs = {};
    if (Object.keys(payload).length) {
        qs.json = JSON.stringify(payload);
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
    var _a, _b, _c, _d, _e, _f;
    const items = [];
    if (!(apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.data) || !Array.isArray(apiResponse.data))
        return items;
    const fields = (_c = (_b = (_a = apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.meta) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b.fields) !== null && _c !== void 0 ? _c : [];
    const indexToKey = [];
    for (const f of fields) {
        if (typeof (f === null || f === void 0 ? void 0 : f.data_column) === 'number') {
            // prefer requested id; fall back to internal field_id
            indexToKey[f.data_column] = (_e = (_d = f === null || f === void 0 ? void 0 : f.id) !== null && _d !== void 0 ? _d : f === null || f === void 0 ? void 0 : f.field_id) !== null && _e !== void 0 ? _e : `col_${f.data_column}`;
        }
    }
    for (const row of apiResponse.data) {
        const obj = {};
        for (let i = 0; i < row.length; i++) {
            const key = (_f = indexToKey[i]) !== null && _f !== void 0 ? _f : `col_${i}`;
            obj[key] = row[i];
        }
        items.push(obj);
    }
    return items;
}
function buildDateRangeParam(dr) {
    var _a, _b;
    const type = ((_a = dr.dateRangeType) !== null && _a !== void 0 ? _a : '').toLowerCase();
    if (type === 'custom') {
        // Only pass explicit dates for custom
        return { date_range_type: 'custom', start_date: dr.startDate, end_date: dr.endDate };
    }
    // X-types → last_<X>_<unit>[ _iso ][ _inc ]
    const isXType = ['lastxdays', 'lastxweeks', 'lastxweeksiso', 'lastxmonths', 'lastxyears'].includes(type);
    if (isXType) {
        const x = Math.max(1, Number((_b = dr.xValue) !== null && _b !== void 0 ? _b : 1) || 1);
        const inc = dr.includeCurrent ? '_inc' : '';
        switch (type) {
            case 'lastxdays':
                return { date_range_type: `last_${x}_days${inc}` };
            case 'lastxweeks':
                return { date_range_type: `last_${x}_weeks${inc}` }; // Sun–Sat
            case 'lastxweeksiso':
                return { date_range_type: `last_${x}_weeks_iso${inc}` }; // Mon–Sun
            case 'lastxmonths':
                return { date_range_type: `last_${x}_months${inc}` };
            case 'lastxyears':
                return { date_range_type: `last_${x}_years${inc}` };
        }
    }
    // All other presets → pass through as-is
    // (today, yesterday, lastweeksunsat, lastweekmonsun, thismonth, thismonthtoyesterday,
    //  lastmonth, thisyear, lastyear, lastyeartodate)
    return { date_range_type: type };
}
