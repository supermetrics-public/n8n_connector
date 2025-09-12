import {NodeConnectionType, INodeTypeDescription} from 'n8n-workflow';
import {descriptions as commonParameters} from './parameters/common';
import {descriptions as getDataParameters} from './parameters/getData';

export const versionDescription: INodeTypeDescription =
    {
        displayName: 'Supermetrics',
        name: 'supermetrics',
        icon: 'file:smicon.svg',
        group: ['transform'],
        version: [1],
        description: 'Query marketing data using Supermetrics',
        subtitle: '={{$parameter["operation"]}}',
        defaults: {name: 'Supermetrics'},
        usableAsTool: true,
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [{name: 'supermetricsApi', required: true}],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {name: 'List Data Sources', value: 'getDataSources', action: 'getDataSources'},
                    {name: 'List Fields', value: 'getFields', action: 'getFields'},
                    {name: 'List Accounts', value: 'getAccounts', action: "getAccounts"},
                    {name: 'List Segments', value: 'getSegments', action: 'getSegments'},
                    {name: 'Get Data', value: 'getData', action: 'getData'},
                ],
                default: 'getData',
            },

            ...commonParameters,
            ...getDataParameters,

        ],
    };