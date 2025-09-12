// nodes/Supermetrics/operations/getDataSources.ts
import type { OperationHandler } from './types';
import type { INodeExecutionData } from 'n8n-workflow';
import { fetchDataSources } from '../fetchers';

export const getDataSources: OperationHandler = async (ctx) => {
    const list = await fetchDataSources.call(ctx);
    return (list as any[]).map((row) => ({ json: row })) as INodeExecutionData[];
};
