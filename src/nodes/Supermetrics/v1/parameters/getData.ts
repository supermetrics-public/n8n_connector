import type {INodeProperties} from 'n8n-workflow';
import {smLogger} from "../functions";

const commonGetDataParams: object = {
        ds_accounts: {
            displayName: 'Account Names or IDs',
            name: 'ds_accounts',
            type: 'multiOptions',
            default: [],
            placeholder: '12345,67890',
            description: 'List of data source accounts to fetch data from. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
            displayOptions: {
                show: {
                    operation: ['getData', 'getFields'],
                },
            },
            options: [
                {
                    value: '',
                    name: 'Choose a Data Source First'
                }],
            typeOptions: {
                loadOptionsMethod: 'getAccounts',
                loadOptionsDependsOn: ['ds_id'],
                resetOnChange: true
            },
        },

        fields: {
            displayName: 'Field Names or IDs',
            name: 'fields',
            type: 'multiOptions',
            default: [],
            placeholder: 'date,impressions,clicks',
            description: 'List of data source fields to fetch. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
            options: [
                {
                    value: '',
                    name: 'Choose a Data Source First'
                }],
            displayOptions: {
                show: {
                    operation: ['getData'],
                },
            },
            typeOptions: {
                loadOptionsMethod: 'getFields',
                loadOptionsDependsOn: ['ds_id'],
                resetOnChange: true,
                sortable: true
            },
            required: true,
        },

        dates:
            {
                displayName: 'Date Range',
                name: 'dates',
                type: 'collection',
                displayOptions: {
                    show: {
                        operation: ['getData'],
                    },
                },
                default: {
                    start_date: 'first day of January',
                    end_date: 'yesterday'
                },
                options: [

                    {
                        displayName: 'Start Date',
                        name: 'start_date',
                        type: 'string',
                        default: 'first day of January',
                        hint: 'yyyy-mm-dd or a relative date like "yesterday"',
                        description: 'Either a date in the yyyy-mm-dd format, or anything parseable by PHP\'s strtotime function like "first day of January" or "today". <a href="https://docs.supermetrics.com/apidocs/date-strings">Click here for more info</a>.',
                    },
                    {
                        displayName: 'End Date',
                        name: 'end_date',
                        type: 'string',
                        default: 'yesterday',
                        hint: 'yyyy-mm-dd or a relative date like "yesterday"',
                        description: 'Either a date in the yyyy-mm-dd format, or anything parseable by PHP\'s strtotime function like "first day of January" or "today". <a href="https://docs.supermetrics.com/apidocs/date-strings">Click here for more info</a>.',
                    },
                ]


            },


        optional_parameters:
            {
                displayName: 'Optional Parameters',
                name: 'optional_parameters',
                type: 'collection',
                displayOptions: {
                    show: {
                        operation: ['getData'],
                    },
                },
                default: {
                    filter: '',
                },
                options: [
                    {
                        displayName: 'Filter',
                        name: 'filter',
                        type: 'string',
                        default: '',
                        placeholder: 'impressions > 0 AND clicks > 0',
                        description: 'Optional filter string. Must follow the format "X >= 10 AND ctr <= 20 AND Y =@ Super Campaign", where X and Y must be from the field list for the same data source. <a href="https://docs.supermetrics.com/apidocs/filters">Click here for more info</a>',
                    }]
            },
    }
;

export const descriptions: INodeProperties[] = determineGetDataParameters();

export function determineGetDataParameters(): INodeProperties[] {
    //to do: build logic for parameter visibility by data source
    const params = Object.values(commonGetDataParams) as INodeProperties[];
    smLogger('getData params: ' + JSON.stringify(params));
    return params;
}

