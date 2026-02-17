import type { OperationHandler } from './types';
import type { IDataObject } from 'n8n-workflow';
import { fetchFields } from '../fetchers';

export const getFields: OperationHandler = async (context, i) => {
    const ds_id = context.getNodeParameter('ds_id', i) as string;
    const fields = await fetchFields.call(context, ds_id);
    return fields.map((f: IDataObject) => ({ json: f }));
};
