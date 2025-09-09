"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataSources = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const getDataSources = async (ctx) => {
    try {
        const req = {
            method: 'GET',
            url: 'https://api.supermetrics.com/datasource/search',
            json: true,
        };
        const res = await ctx.helpers.httpRequest(req);
        return res.data.list.map(row => ({ json: row }));
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(ctx.getNode(), error);
    }
};
exports.getDataSources = getDataSources;
