import {IExecuteFunctions, INodeExecutionData} from 'n8n-workflow';

export type OperationHandler = (
    ctx: IExecuteFunctions,
    itemIndex: number
) => Promise<INodeExecutionData[]>;
