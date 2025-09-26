import {
    IDataObject, INodeExecutionData, NodeApiError, JsonObject
} from 'n8n-workflow';
import {supermetricsPostRequest, supermetricsRequest, mapDefaultJsonRowsToItems, smLogger} from '../functions';
import {OperationHandler} from './types';

export const getData: OperationHandler = async (context, i) => {

    smLogger('---------getData start--------------', context);

    const visibleParams = Object.keys(context.getNode().parameters);

    smLogger('getData visibleParams ' + JSON.stringify(visibleParams), context);

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
            case 'dates':
            case 'optional_parameters':
                Object.assign(params, context.getNodeParameter(name, i, {}));
                break;
            case 'ds_accounts':
            case 'fields':
                const rawValue = context.getNodeParameter(name, i, '') as string | string[];
                params[name] = typeof rawValue === 'string' ? rawValue.split(',') : rawValue;
                break;
            default:
                params[name] = context.getNodeParameter(name, i, '') as string;
        }
    }

    if (params.start_date) {
        params.data_range_type = 'custom';
    }

    smLogger('getData params ' + JSON.stringify(params), context);
    smLogger('getData settings ' + JSON.stringify(settings), context);


    const payload: IDataObject = {
        ...params,
        settings: settings
    };

    smLogger('getData payload ' + JSON.stringify(payload), context);

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
