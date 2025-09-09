import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    INodeTypeBaseDescription,
    ILoadOptionsFunctions,
    IDataObject
} from 'n8n-workflow';
import {getData} from './operations/getData';
import {getFields} from './operations/getFields';
import {getAccounts} from './operations/getAccounts';
import {getSegments} from './operations/getSegments';
import {getDataSources} from './operations/getDataSources';
import {versionDescription} from './versionDescription';
import { supermetricsGetRequest} from './GenericFunctions';

export class SupermetricsV1 implements INodeType {
    description: INodeTypeDescription;

    constructor(baseDescription: INodeTypeBaseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription,
        };
    }

    methods = {
        loadOptions: {

            async getDataSources(this: ILoadOptionsFunctions) {
                const res = await this.helpers.httpRequest({
                    method: 'GET',
                    url: 'https://api.supermetrics.com/datasource/search',
                    json: true,
                });

                const list = res?.data?.list ?? [];
                return list.map((ds: any) => ({
                    name: ds.name,
                    value: ds.id,
                    description: ds.description ?? '',
                }));
            },

            async getFields(this: ILoadOptionsFunctions) {
                const dsId = this.getNodeParameter('dsId', 0) as string;
                if (!dsId) return [];
                const payload: IDataObject = {ds_id: dsId};
                const res = await supermetricsGetRequest.call(this, '/query/fields', payload);
                const fields = (res?.data ?? []) as Array<Record<string, string>>;
                return fields.map((f) => ({
                    name: `${f.field_name ?? f.field_id} (${f.field_type})`,
                    value: f.field_id,
                    description: f.description ?? '',
                }));
            },
        },
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const operation = this.getNodeParameter('operation', 0) as string;

        const handlers: Record<string, (i: number) => Promise<INodeExecutionData[]>> = {
            getData: (i) => getData(this, i),
            getFields: (i) => getFields(this, i),
            getAccounts: (i) => getAccounts(this, i),
            getSegments: (i) => getSegments(this, i),
            getDataSources: (i) => getDataSources(this, i),
        };

        const handler = handlers[operation];
        if (!handler) throw new Error(`Unknown operation: ${operation}`);

        const all: INodeExecutionData[] = [];
        for (let i = 0; i < items.length; i++) {
            const chunk = await handler(i);
            all.push(...chunk);
        }
        return [all];
    }
}
