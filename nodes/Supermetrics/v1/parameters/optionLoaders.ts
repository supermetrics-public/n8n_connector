// nodes/Supermetrics/loadOptions.ts
import {IDataObject, ILoadOptionsFunctions, INodePropertyOptions} from 'n8n-workflow';
import { fetchDataSources, fetchFields, fetchAccounts } from '../fetchers';
import {cleanDsUserDisplayName} from '../functions';

export const loadOptions = {
    async getDataSources(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const list = await fetchDataSources.call(this);
        return list.map((ds: IDataObject) => ({
            name: ds.name as string,
            value: ds.id as string,
            description: (ds.description ?? '') as string,
        }));
    },

    async getFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const ds_id = this.getNodeParameter('ds_id', 0) as string;
        if (!ds_id) {
            return  [{
                value: '',
                name: 'Choose a Data Source First'
            }];
        }
        const fields = await fetchFields.call(this, ds_id);
        return fields.map((f: IDataObject) => ({
            name: `${f.field_name ?? f.field_id}`,
            value: f.field_id as string,
            description: [ (f.field_type === 'met' ? 'Metric' : 'Dimension'),f.group_name, f.description ].filter(Boolean).join(' • '),
        }));
    },

    async getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const ds_id = this.getNodeParameter('ds_id', 0) as string;
        if (!ds_id) {
            return  [{
                value: '',
                name: 'Choose a Data Source First'
            }];
        }
        const data = await fetchAccounts.call(this, ds_id);
        const out: INodePropertyOptions[] = [];
        for (const login of data as IDataObject[]) {
            for (const acc of (login?.accounts ?? []) as IDataObject[]) {
                out.push({
                    name: (acc.account_name || String(acc.account_id)) as string,
                    value: String(acc.account_id),
                    description: [String(acc.account_id), acc.group_name, cleanDsUserDisplayName(login.display_name as string)].filter(Boolean).join(' • '),
                });
            }
        }

        if (out.length === 0) {
            return [
                {
                    name: '— No Accounts Found for This Data Source —',
                    value: '',
                    description: 'You can connect to the data source <a href="https://hub.supermetrics.com/token-management#dataSource'+ds_id+'" target="blank">here ☍</a>',
                },
            ];
        }

        out.sort((a, b) => a.name.localeCompare(b.name));

        return out;
    },
};
