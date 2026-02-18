import type {INodeProperties} from 'n8n-workflow';

export const descriptions: INodeProperties[] = [

    {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
            {
                name: 'Account',
                value: 'account',
                description: 'Accounts you have access to within a data source',
            },
            {
                name: 'Data',
                value: 'data',
                description: 'Query marketing data from a data source',
            },
            {
                name: 'Data Source',
                value: 'dataSource',
                description: 'Marketing platforms available through Supermetrics',
            },
            {
                name: 'Field',
                value: 'field',
                description: 'Metrics and dimensions available for a data source',
            },
            {
                name: 'Segment',
                value: 'segment',
                description: 'Segments available for a data source',
            },
        ],
        default: 'data',
    },

    // Operations per resource

    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['data'],
            },
        },
        options: [
            {
                name: 'Query',
                value: 'query',
                action: 'Query data',
                description: 'Get data from a specified source via Supermetrics',
            },
        ],
        default: 'query',
    },
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['dataSource'],
            },
        },
        options: [
            {
                name: 'Get Many',
                value: 'getMany',
                action: 'Get many data sources',
                description: 'Get the list of data sources available through Supermetrics',
            },
        ],
        default: 'getMany',
    },
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['account'],
            },
        },
        options: [
            {
                name: 'Get Many',
                value: 'getMany',
                action: 'Get many accounts',
                description: 'Get the list of accounts you have access to within a data source',
            },
        ],
        default: 'getMany',
    },
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['field'],
            },
        },
        options: [
            {
                name: 'Get Many',
                value: 'getMany',
                action: 'Get many fields',
                description: 'Get the list of fields available for a data source',
            },
        ],
        default: 'getMany',
    },
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['segment'],
            },
        },
        options: [
            {
                name: 'Get Many',
                value: 'getMany',
                action: 'Get many segments',
                description: 'Get the list of segments available for a data source',
            },
        ],
        default: 'getMany',
    },

    {
        displayName: 'Data Source Name or ID',
        name: 'ds_id',
        type: 'options',
        default: 'FA',
        description: 'Choose a Supermetrics data source. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        options: [
            {
                value: 'FA',
                name: 'List Is Loading...'
            }],
        displayOptions: {
            show: {
                resource: ['data', 'field', 'account', 'segment'],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getDataSources',
        },
        required: true
    },
];