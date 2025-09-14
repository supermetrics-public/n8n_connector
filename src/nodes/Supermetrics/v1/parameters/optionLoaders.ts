// nodes/Supermetrics/loadOptions.ts
import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { fetchDataSources, fetchFields, fetchAccounts } from '../fetchers';

export const loadOptions = {
    async getDataSources(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const list = await fetchDataSources.call(this);
        return list.map((ds: any) => ({
            name: ds.name,
            value: ds.id,
            description: ds.description ?? '',
        }));
    },

    async getFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const ds_id = this.getNodeParameter('ds_id', 0) as string;
        if (!ds_id) return [];
        const fields = await fetchFields.call(this, ds_id);
        return fields.map((f: any) => ({
            name: `${f.field_name ?? f.field_id} (${f.field_type})`,
            value: f.field_id,
            description: f.description ?? '',
        }));
    },

    async getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const ds_id = this.getNodeParameter('ds_id', 0) as string;
        if (!ds_id) return [];
        const data = await fetchAccounts.call(this, ds_id);
        const out: INodePropertyOptions[] = [];
        for (const login of data as any[]) {
            for (const acc of login?.accounts ?? []) {
                out.push({
                    name: acc.account_name || String(acc.account_id),
                    value: String(acc.account_id),
                    description: [login.display_name, acc.group_name].filter(Boolean).join(' • '),
                });
            }
        }
        out.sort((a, b) => a.name.localeCompare(b.name));
        return out;
    },
};
