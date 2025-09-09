import {IDataObject, INodeExecutionData} from 'n8n-workflow';
import {supermetricsGetRequest} from '../GenericFunctions';
import {OperationHandler} from './types';

export const getFields: OperationHandler = async (ctx, i) => {
    const dsId = ctx.getNodeParameter('dsId', i) as string;
    const payload: IDataObject = {ds_id: dsId};
    const res = await supermetricsGetRequest.call(ctx, '/query/fields', payload);
    return (res?.data ?? []).map((f: any) => ({json: f})) as INodeExecutionData[];
};
