import type { OperationHandler } from './types';
import  { type IDataObject, type INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { fetchAccounts } from '../fetchers';

export const getAccounts: OperationHandler = async (context, i) => {
    const ds_id = context.getNodeParameter('ds_id', i) as string;
    const data = await fetchAccounts.call(context, ds_id);

    const out: INodeExecutionData[] = [];

    for (const login of data as IDataObject[]) {
        for (const acc of (login?.accounts ?? []) as IDataObject[]) {
            out.push({
                json: {
                    ds_user: login.ds_user,
                    display_name: login.display_name,
                    cache_time: login.cache_time,
                    account_id: acc.account_id,
                    account_name: acc.account_name,
                    group_name: acc.group_name,
                },
            });
        }
    }


    // 🚨 if nothing was pushed, error out
    if (out.length === 0) {
        throw new NodeOperationError(
            context.getNode(),
            `No accounts found for the selected data source.`,
            {
                description: 'You can connect to the data source <a href="https://hub.supermetrics.com/token-management#dataSource'+ds_id+'" target="blank">here ☍</a>.',
            },
        );
    }


    return out;
};
