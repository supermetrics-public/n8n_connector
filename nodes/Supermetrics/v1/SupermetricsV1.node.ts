import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    INodeTypeBaseDescription,
    NodeOperationError
} from 'n8n-workflow';
import {getData} from './actions/getData';
import {getFields} from './actions/getFields';
import {getAccounts} from './actions/getAccounts';
import {getSegments} from './actions/getSegments';
import {getDataSources} from './actions/getDataSources';
import {versionDescription} from './versionDescription';
import { loadOptions } from './parameters/optionLoaders';

export class SupermetricsV1 implements INodeType {
    description: INodeTypeDescription;

    constructor(baseDescription: INodeTypeBaseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription,
        };
    }

    methods = {
        loadOptions,
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
        if (!handler) {
            throw new NodeOperationError(this.getNode(),`Unknown operation: ${operation}`);
        }

        const all: INodeExecutionData[] = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const chunk = await handler(i);
                all.push(...chunk);
            } catch (error) {
                if (this.continueOnFail()) {
                    all.push({
                        json: { error: (error as Error).message },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [all];
    }
}
