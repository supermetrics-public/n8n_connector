/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import {INodeTypeDescription, NodeConnectionTypes} from 'n8n-workflow';
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
        subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
        defaults: {name: 'Supermetrics'},
        usableAsTool: true,
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [{name: 'supermetricsApi', required: true}],
        properties: [
            ...commonParameters,
            ...getDataParameters,

        ],
    };