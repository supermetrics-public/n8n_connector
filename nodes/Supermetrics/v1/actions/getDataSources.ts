// nodes/Supermetrics/actions/getDataSources.ts
import type { OperationHandler } from './types';
import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import { fetchDataSources } from '../fetchers';

export const getDataSources: OperationHandler = async (context) => {
    const list = await fetchDataSources.call(context);
    return (list as IDataObject[]).map((row) => ({ json: row })) as INodeExecutionData[];
};
