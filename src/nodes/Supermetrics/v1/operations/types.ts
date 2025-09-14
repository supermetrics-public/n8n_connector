import {IExecuteFunctions, INodeExecutionData} from 'n8n-workflow';

export type OperationHandler = (
    context: IExecuteFunctions,
    itemIndex: number
) => Promise<INodeExecutionData[]>;


