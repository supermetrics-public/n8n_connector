"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionDescription = void 0;
const common_1 = require("./parameters/common");
const getData_1 = require("./parameters/getData");
exports.versionDescription = {
    displayName: 'Supermetrics',
    name: 'supermetrics',
    icon: 'file:smicon.svg',
    group: ['transform'],
    version: 1,
    description: 'Query marketing data using Supermetrics',
    subtitle: '={{$parameter["operation"]}}',
    defaults: { name: 'Supermetrics' },
    usableAsTool: true,
    inputs: ["main" /* NodeConnectionType.Main */],
    outputs: ["main" /* NodeConnectionType.Main */],
    credentials: [{ name: 'supermetricsApi', required: true }],
    properties: [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            options: [
                { name: 'List Data Sources', value: 'getDataSources', action: 'getDataSources' },
                { name: 'List Fields', value: 'getFields', action: 'getFields' },
                { name: 'List Accounts', value: 'getAccounts', action: "getAccounts" },
                { name: 'List Segments', value: 'getSegments', action: 'getSegments' },
                { name: 'Get Data', value: 'getData', action: 'getData' },
            ],
            default: 'getData',
        },
        ...common_1.descriptions,
        ...getData_1.descriptions,
    ],
};
