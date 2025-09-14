/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { NodeConnectionType, INodeTypeDescription } from 'n8n-workflow';
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
        inputs: ['main'] as NodeConnectionType[],
        outputs: ['main'] as NodeConnectionType[],
        credentials: [{name: 'supermetricsApi', required: true}],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
				noDataExpression: true,
                options: [
                    {name: 'Get Data', value: 'getData', action: 'Get data'},
                    {name: 'List Accounts', value: 'getAccounts', action: 'Get accounts'},
                    {name: 'List Data Sources', value: 'getDataSources', action: 'Get data sources'},
                    {name: 'List Fields', value: 'getFields', action: 'Get fields'},
                ],
                default: 'getData',
            },

            ...commonParameters,
            ...getDataParameters,

        ],
    };