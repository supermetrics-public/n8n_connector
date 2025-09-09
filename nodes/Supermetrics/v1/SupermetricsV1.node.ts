import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    INodeTypeBaseDescription
} from 'n8n-workflow';
import {getData} from './operations/getData';
import {getFields} from './operations/getFields';
import {getAccounts} from './operations/getAccounts';
import {getSegments} from './operations/getSegments';
import {getDataSources} from './operations/getDataSources';
import {versionDescription} from './versionDescription';

export class SupermetricsV1 implements INodeType {
    description: INodeTypeDescription;

    constructor(baseDescription: INodeTypeBaseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription,
        };
    }

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
