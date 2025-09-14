import type { OperationHandler } from './types';
import { fetchFields } from '../fetchers';

export const getFields: OperationHandler = async (context, i) => {
    const ds_id = context.getNodeParameter('ds_id', i) as string;
    const fields = await fetchFields.call(context, ds_id);
    return fields.map((f: any) => ({ json: f }));
};
