import {IDataObject, INodeExecutionData} from 'n8n-workflow';
import {supermetricsGetRequest} from '../functions';
import {OperationHandler} from './types';

export const getSegments: OperationHandler = async (context, i) => {
    const ds_id = context.getNodeParameter('ds_id', i) as string;
    const payload: IDataObject = {ds_id: ds_id};
    const res = await supermetricsGetRequest.call(context, '/query/segments', payload);

    const out: INodeExecutionData[] = [];
    for (const login of res?.data ?? []) {
        for (const s of login?.segments ?? []) {
            out.push({json: {...s, ds_user: login.ds_user}});
        }
    }
    return out;
};
