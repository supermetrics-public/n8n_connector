import type { OperationHandler } from './types';
import type { INodeExecutionData } from 'n8n-workflow';
import { fetchAccounts } from '../fetchers';

export const getAccounts: OperationHandler = async (context, i) => {
    const ds_id = context.getNodeParameter('ds_id', i) as string;
    const data = await fetchAccounts.call(context, ds_id);

    const out: INodeExecutionData[] = [];
    for (const login of data as any[]) {
        for (const acc of login?.accounts ?? []) {
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
    return out;
};
