"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupermetricsV1 = void 0;
const getData_1 = require("./operations/getData");
const getFields_1 = require("./operations/getFields");
const getAccounts_1 = require("./operations/getAccounts");
const getSegments_1 = require("./operations/getSegments");
const getDataSources_1 = require("./operations/getDataSources");
const versionDescription_1 = require("./versionDescription");
const optionLoaders_1 = require("./parameters/optionLoaders");
class SupermetricsV1 {
    constructor(baseDescription) {
        this.methods = {
            loadOptions: optionLoaders_1.loadOptions,
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
