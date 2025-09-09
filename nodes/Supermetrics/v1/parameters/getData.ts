import type { INodeProperties } from 'n8n-workflow';

export const descriptions: INodeProperties[] = [

    {
        displayName: 'Accounts',
        name: 'dsAccounts',
        type: 'multiOptions',
        default: [],
        placeholder: '12345,67890',
        description: 'Comma-separated list of account IDs (if required by the data source). Use List Accounts operation to discover valid IDs for your data source.',
        displayOptions: {
            show: {
                operation: ['getData', 'getFields'],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getAccounts',
            loadOptionsDependsOn: ['dsId'],
        },
    },

    {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'string',
        default: 'first day of January',
        description: 'Either a date in the yyyy-mm-dd format, or anything parseable by PHP\'s strtotime function like "first day of January" or "today"',
        displayOptions: {
            show: {
                operation: ['getData'],
            },
        },
    },
    {
        displayName: 'End Date',
        name: 'endDate',
        type: 'string',
        default: 'yesterday',
        description: 'Either a date in the yyyy-mm-dd format, or anything parseable by PHP\'s strtotime function like "first day of January" or "today"',
        displayOptions: {
            show: {
                operation: ['getData'],
            },
        },
    },

    {
        displayName: 'Fields',
        name: 'fields',
        type: 'multiOptions',
        default: [],
        placeholder: 'date,impressions,clicks',
        description:
            'Comma-separated field IDs. Use List Fields operation to discover valid IDs for your data source.',
        displayOptions: {
            show: {
                operation: ['getData'],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getFields',
            loadOptionsDependsOn: ['dsId'],
        },
        required: true,
    },
    {
        displayName: 'Filter',
        name: 'filter',
        type: 'string',
        default: '',
        placeholder: 'impressions > 0 AND clicks > 0',
        description: 'Optional filter string. Must follow the format "X >= 10 AND ctr <= 20 AND Y =@ Super Campaign", where X and Y must be from the field list for the same data source. ',
        displayOptions: {
            show: {
                operation: ['getData'],
            },
        },
    },
];