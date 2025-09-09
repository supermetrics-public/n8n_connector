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
    {
        displayName: 'Accounts',
        name: 'dsAccounts',
        type: 'string',
        default: '',
        placeholder: '12345,67890',
        description: 'Comma-separated list of account IDs (if required by the data source). Use List Accounts operation to discover valid IDs for your data source.',
        displayOptions: {
            show: {
                operation: ['getData', 'getFields'],
            },
        },
    },
    {
        displayName: 'Users',
        name: 'dsUsers',
        type: 'string',
        default: '',
        placeholder: 'user@example.com,user2@example.com',
        description: 'Comma-separated list of login usernames to target.',
        displayOptions: {
            show: {
                operation: [''],
            },
        },
    },
    {
        displayName: 'Segments',
        name: 'dsSegments',
        type: 'string',
        default: '',
        placeholder: 'segment1,segment2',
        description: 'Comma-separated list of segment IDs (if supported by the data source).',
        displayOptions: {
            show: {
                operation: [''],
            },
        },
    },
];