import {
    IDataObject, INodeExecutionData, NodeApiError, JsonObject
} from 'n8n-workflow';
import {supermetricsPostRequest, supermetricsRequest, mapDefaultJsonRowsToItems, smLogger} from '../functions';
import {OperationHandler} from './types';

export const getData: OperationHandler = async (context, i) => {

    smLogger(context, '---------getData start--------------');

    const visibleParams = Object.keys(context.getNode().parameters);

    smLogger(context, 'getData visibleParams ' + JSON.stringify(visibleParams));

    const settings: Record<string, unknown> = {no_headers: true, no_json_keys: true};
    const params: Record<string, unknown> = {};
    for (const name of visibleParams) {
        if (name.startsWith('settings_')) {
            settings[name.replace('settings_', '')] = context.getNodeParameter(name, i) as string;
            continue;
        }
        switch (name) {
            case 'operation':
                break;
            case 'ds_accounts':
            case 'fields':
                const rawValue = context.getNodeParameter(name, i, '') as string | string[];
                params[name] = typeof rawValue === 'string' ? [rawValue] : rawValue;
                break;
            default:
                params[name] = context.getNodeParameter(name, i) as string;
        }
    }

    if (params.start_date) {
        params.data_range_type = 'custom';
    }

    smLogger(context, 'getData params ' + JSON.stringify(params));
    smLogger(context, 'getData settings ' + JSON.stringify(settings));


    const payload: IDataObject = {
        ...params,
        settings: settings,
        system: 'n8n'
    };

    smLogger(context, 'getData payload ' + JSON.stringify(payload));

    try {
        const res = await supermetricsPostRequest.call(context, '/query/data/json', payload);

        const out: INodeExecutionData[] = [];

        for (const r of mapDefaultJsonRowsToItems(res)) out.push({json: r});

        let nextUrl = res?.meta?.paginate?.next as string | null | undefined;
        while (nextUrl) {
            const page = await supermetricsRequest.call(context, 'GET', nextUrl);
            for (const r of mapDefaultJsonRowsToItems(page)) out.push({json: r});
            nextUrl = page?.meta?.paginate?.next ?? null;
        }

        return out;
    } catch (error) {
        throw new NodeApiError(context.getNode(), (error as any) as JsonObject);
    }
};
