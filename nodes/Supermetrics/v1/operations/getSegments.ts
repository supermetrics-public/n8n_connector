import {IDataObject, INodeExecutionData} from 'n8n-workflow';
import {supermetricsGetRequest} from '../GenericFunctions';
import {OperationHandler} from './types';

export const getSegments: OperationHandler = async (ctx, i) => {
    const dsId = ctx.getNodeParameter('dsId', i) as string;
    const payload: IDataObject = {ds_id: dsId};
    const res = await supermetricsGetRequest.call(ctx, '/query/segments', payload);

    const out: INodeExecutionData[] = [];
    for (const login of res?.data ?? []) {
        for (const s of login?.segments ?? []) {
            out.push({json: {...s, ds_user: login.ds_user}});
        }
    }
    return out;
};
