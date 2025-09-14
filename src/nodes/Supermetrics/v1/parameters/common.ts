import type { INodeProperties } from 'n8n-workflow';

export const descriptions: INodeProperties[] = [
    {
        displayName: 'Data Source Name or ID',
        name: 'ds_id',
        type: 'options',
        default: '',
        description: 'Supermetrics data source ID (e.g., <code>GAWA</code> for Google Analytics 4). Refer to their data source docs. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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