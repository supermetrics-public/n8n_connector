import type { OperationHandler } from './types';
import { fetchFields } from '../fetchers';

export const getFields: OperationHandler = async (ctx, i) => {
    const dsId = ctx.getNodeParameter('dsId', i) as string;
    const fields = await fetchFields.call(ctx, dsId);
    return fields.map((f: any) => ({ json: f }));
};
