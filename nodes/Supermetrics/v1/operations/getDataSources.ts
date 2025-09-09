import {IHttpRequestOptions, INodeExecutionData, NodeApiError, JsonObject} from 'n8n-workflow';
import {OperationHandler} from './types';

export const getDataSources: OperationHandler = async (ctx) => {
    try {
        const req: IHttpRequestOptions = {
            method: 'GET',
            url: 'https://api.supermetrics.com/datasource/search',
            json: true,
        };

        const res = await ctx.helpers.httpRequest(req);
        return (res.data.list as any[]).map(row => ({json: row})) as INodeExecutionData[];
    } catch (error) {
        throw new NodeApiError(ctx.getNode(), (error as any) as JsonObject);
    }
};
