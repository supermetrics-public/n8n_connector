"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../GenericFunctions");
const getData = async (ctx, i) => {
    var _a, _b, _c, _d, _e;
    const dsId = ctx.getNodeParameter('dsId', i);
    const dsAccounts = ctx.getNodeParameter('dsAccounts', i, '');
    const fields = ctx.getNodeParameter('fields', i);
    const filter = ctx.getNodeParameter('filter', i, '');
    const startDate = ctx.getNodeParameter('startDate', i, '');
    const endDate = ctx.getNodeParameter('endDate', i, '');
    const dateRangeParam = { date_range_type: 'custom', start_date: startDate, end_date: endDate };
    const payload = {
        ds_id: dsId,
        system: 'n8n',
        ...(dsAccounts ? { ds_accounts: dsAccounts.split(',').map(s => s.trim()) } : {}),
        ...(fields ? { fields: fields.split(',').map(s => s.trim()) } : {}),
        ...(filter ? { filter } : {}),
        ...dateRangeParam,
        settings: { no_headers: true, no_json_keys: true, round_metrics_to: 4 },
    };
    try {
        const res = await GenericFunctions_1.supermetricsPostRequest.call(ctx, '/query/data/json', payload);
        const out = [];
        for (const r of (0, GenericFunctions_1.mapDefaultJsonRowsToItems)(res))
            out.push({ json: r });
        let nextUrl = (_b = (_a = res === null || res === void 0 ? void 0 : res.meta) === null || _a === void 0 ? void 0 : _a.paginate) === null || _b === void 0 ? void 0 : _b.next;
        while (nextUrl) {
            const page = await GenericFunctions_1.supermetricsRequest.call(ctx, 'GET', nextUrl);
            for (const r of (0, GenericFunctions_1.mapDefaultJsonRowsToItems)(page))
                out.push({ json: r });
            nextUrl = (_e = (_d = (_c = page === null || page === void 0 ? void 0 : page.meta) === null || _c === void 0 ? void 0 : _c.paginate) === null || _d === void 0 ? void 0 : _d.next) !== null && _e !== void 0 ? _e : null;
        }
        return out;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(ctx.getNode(), error);
    }
};
exports.getData = getData;
