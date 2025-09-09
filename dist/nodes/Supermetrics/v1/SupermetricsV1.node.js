"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupermetricsV1 = void 0;
const getData_1 = require("./operations/getData");
const getFields_1 = require("./operations/getFields");
const getAccounts_1 = require("./operations/getAccounts");
const getSegments_1 = require("./operations/getSegments");
const getDataSources_1 = require("./operations/getDataSources");
const versionDescription_1 = require("./versionDescription");
const GenericFunctions_1 = require("./GenericFunctions");
class SupermetricsV1 {
    constructor(baseDescription) {
        this.methods = {
            loadOptions: {
                async getDataSources() {
                    var _a, _b;
                    const res = await this.helpers.httpRequest({
                        method: 'GET',
                        url: 'https://api.supermetrics.com/datasource/search',
                        json: true,
                    });
                    const list = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.list) !== null && _b !== void 0 ? _b : [];
                    return list.map((ds) => {
                        var _a;
                        return ({
                            name: ds.name,
                            value: ds.id,
                            description: (_a = ds.description) !== null && _a !== void 0 ? _a : '',
                        });
                    });
                },
                async getFields() {
                    var _a;
                    const dsId = this.getNodeParameter('dsId', 0);
                    if (!dsId)
                        return [];
                    const payload = { ds_id: dsId };
                    const res = await GenericFunctions_1.supermetricsGetRequest.call(this, '/query/fields', payload);
                    const fields = ((_a = res === null || res === void 0 ? void 0 : res.data) !== null && _a !== void 0 ? _a : []);
                    return fields.map((f) => {
                        var _a, _b;
                        return ({
                            name: `${(_a = f.field_name) !== null && _a !== void 0 ? _a : f.field_id} (${f.field_type})`,
                            value: f.field_id,
                            description: (_b = f.description) !== null && _b !== void 0 ? _b : '',
                        });
                    });
                },
            },
        };
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
        };
    }
    async execute() {
        const items = this.getInputData();
        const operation = this.getNodeParameter('operation', 0);
        const handlers = {
            getData: (i) => (0, getData_1.getData)(this, i),
            getFields: (i) => (0, getFields_1.getFields)(this, i),
            getAccounts: (i) => (0, getAccounts_1.getAccounts)(this, i),
            getSegments: (i) => (0, getSegments_1.getSegments)(this, i),
            getDataSources: (i) => (0, getDataSources_1.getDataSources)(this, i),
        };
        const handler = handlers[operation];
        if (!handler)
            throw new Error(`Unknown operation: ${operation}`);
        const all = [];
        for (let i = 0; i < items.length; i++) {
            const chunk = await handler(i);
            all.push(...chunk);
        }
        return [all];
    }
}
exports.SupermetricsV1 = SupermetricsV1;
