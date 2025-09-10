import {IDataObject, INodeExecutionData, NodeApiError, JsonObject} from 'n8n-workflow';
import {supermetricsPostRequest, supermetricsRequest, mapDefaultJsonRowsToItems} from '../genericFunctions';
import {OperationHandler} from './types';

export const getData: OperationHandler = async (ctx, i) => {
    const dsId = ctx.getNodeParameter('dsId', i) as string;
    const accountsParam = ctx.getNodeParameter('dsAccounts', i, '') as string | string[];
    const accounts = Array.isArray(accountsParam) ? accountsParam.join(',') : accountsParam;
    const fieldsParam = ctx.getNodeParameter('fields', i) as string | string[];
    const fields = Array.isArray(fieldsParam) ? fieldsParam.join(',') : fieldsParam;
    const filter = ctx.getNodeParameter('filter', i, '') as string;
    const startDate = ctx.getNodeParameter('startDate', i, '') as string;
    const endDate = ctx.getNodeParameter('endDate', i, '') as string;
    const dateRangeParam = {date_range_type: 'custom', start_date: startDate, end_date: endDate};

    const payload: IDataObject = {
        ds_id: dsId,
        system: 'n8n',
        ...(accounts ? {ds_accounts: accounts.split(',').map(s => s.trim())} : {}),
        ...(fields ? {fields: fields.split(',').map(s => s.trim())} : {}),
        ...(filter ? {filter} : {}),
        ...dateRangeParam,
        settings: {no_headers: true, no_json_keys: true, round_metrics_to: 4},
    };

    try {
        const res = await supermetricsPostRequest.call(ctx, '/query/data/json', payload);

        const out: INodeExecutionData[] = [];

        for (const r of mapDefaultJsonRowsToItems(res)) out.push({json: r});

        let nextUrl = res?.meta?.paginate?.next as string | null | undefined;
        while (nextUrl) {
            const page = await supermetricsRequest.call(ctx, 'GET', nextUrl);
            for (const r of mapDefaultJsonRowsToItems(page)) out.push({json: r});
            nextUrl = page?.meta?.paginate?.next ?? null;
        }

        return out;
    } catch (error) {
        throw new NodeApiError(ctx.getNode(), (error as any) as JsonObject);
    }
};
