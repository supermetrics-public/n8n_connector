"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.descriptions = void 0;
exports.descriptions = [
    {
        displayName: 'Data Source ID',
        name: 'dsId',
        type: 'options',
        default: 'FA',
        description: 'Supermetrics data source ID (e.g., <code>GAWA</code> for Google Analytics 4). Refer to their data source docs.',
        displayOptions: {
            show: {
                operation: ['getData', 'getFields', 'getAccounts', 'getSegments'],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getDataSources',
        },
        required: true,
    },
];
