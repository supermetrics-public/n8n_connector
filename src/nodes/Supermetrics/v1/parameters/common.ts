import type {INodeProperties} from 'n8n-workflow';

export const descriptions: INodeProperties[] = [

    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
            {
                name: 'List Data Sources',
                value: 'getDataSources',
                action: 'Get data sources',
                description: 'Get the list of data sources available through Supermetrics. Choose the data source from this list and get its fields and accounts, and then run "Get Data" actions.'
            },
            {
                name: 'List Data Source Accounts',
                value: 'getAccounts',
                action: 'Get accounts',
                description: 'Get the list of accounts you have access to within a data source. You can run a "Get Data" operation on these accounts to get their data.'
            },
            {
                name: 'List Data Source Fields',
                value: 'getFields',
                action: 'Get fields',
                description: 'Get the list of fields available for a data source. You can then use these fields in a "Get Data" operation.'
            },
            {
                name: 'Get Data',
                value: 'getData',
                action: 'Get data',
                description: 'Get data from a specified source via Supermetrics'
            },
        ],
        default: 'getData',
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
                operation: ['getData', 'getFields', 'getAccounts', 'getSegments'],
            },
        },
        typeOptions: {
            loadOptionsMethod: 'getDataSources',
        },
        required: true
    },
];