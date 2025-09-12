import type { INodeProperties } from 'n8n-workflow';

export const descriptions: INodeProperties[] = [
    {
        displayName: 'Data Source ID',
        name: 'dsId',
        type: 'options',
        default: 'FA',
        description:
            'Supermetrics data source ID (e.g., <code>GAWA</code> for Google Analytics 4). Refer to their data source docs.',
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