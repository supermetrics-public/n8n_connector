import type { INodeProperties } from 'n8n-workflow';

export const descriptions: INodeProperties[] = [

    {
        displayName: 'Account Names or IDs',
        name: 'ds_accounts',
        type: 'multiOptions',
        default: [],
        placeholder: '12345,67890',
        description: 'Comma-separated list of account IDs (if required by the data source). Use List Accounts operation to discover valid IDs for your data source. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        displayOptions: {
            show: {
                operation: ['getData', 'getFields'],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getAccounts',
            loadOptionsDependsOn: ['ds_id'],
        },
    },

    {
        displayName: 'Start Date',
        name: 'start_date',
        type: 'string',
        default: 'first day of January',
        description: 'Either a date in the yyyy-mm-dd format, or anything parseable by PHP\'s strtotime function like "first day of January" or "today"',
        displayOptions: {
            show: {
                operation: ['getData'],
            },
        },
        required: true,
    },
    {
        displayName: 'End Date',
        name: 'end_date',
        type: 'string',
        default: 'yesterday',
        description: 'Either a date in the yyyy-mm-dd format, or anything parseable by PHP\'s strtotime function like "first day of January" or "today"',
        displayOptions: {
            show: {
                operation: ['getData'],
            },
        },
        required: true,
    },

    {
        displayName: 'Field Names or IDs',
        name: 'fields',
        type: 'multiOptions',
        default: [],
        placeholder: 'date,impressions,clicks',
        description: 'Comma-separated field IDs. Use List Fields operation to discover valid IDs for your data source. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        displayOptions: {
            show: {
                operation: ['getData'],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getFields',
            loadOptionsDependsOn: ['ds_id'],
        },
        required: true,
    },



    {
        displayName: 'App Store Country',
        name: 'settings_country',
        type: 'options',
        default: 'US',
        displayOptions: {
            show: {
                operation: ['getData'],
                ds_id: ['APPD'],
            },
        },
        options: [
            {
                name: 'United States',
                value: 'US',
            },
            {
                name: 'Finland',
                value: 'FI',
            },
        ],
        required: true,
    },



    {
        displayName: 'Filter',
        name: 'filter',
        type: 'string',
        default: '',
        placeholder: 'impressions > 0 AND clicks > 0',
        description: 'Optional filter string. Must follow the format "X >= 10 AND ctr <= 20 AND Y =@ Super Campaign", where X and Y must be from the field list for the same data source.',
        displayOptions: {
            show: {
                operation: ['getData'],
            },
        },
    },
];