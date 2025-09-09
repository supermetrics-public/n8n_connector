import type { ILoadOptionsFunctions, IDataObject, INodePropertyOptions } from 'n8n-workflow';
import { supermetricsGetRequest } from '../GenericFunctions';

export const loadOptions = {
    async getDataSources(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const res = await this.helpers.httpRequest({
            method: 'GET',
            url: 'https://api.supermetrics.com/datasource/search',
            json: true,
        });

        const list = res?.data?.list ?? [];
        return list.map((ds: any) => ({
            name: ds.name,
            value: ds.id,
            description: ds.description ?? '',
        }));
    },

    async getFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const dsId = this.getNodeParameter('dsId', 0) as string;
        if (!dsId) return [];
        const payload: IDataObject = { ds_id: dsId };
        const res = await supermetricsGetRequest.call(this, '/query/fields', payload);
        const fields = (res?.data ?? []) as Array<Record<string, string>>;
        return fields.map((f) => ({
            name: `${f.field_name ?? f.field_id} (${f.field_type})`,
            value: f.field_id,
            description: f.description ?? '',
        }));
    },

    async getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const dsId = this.getNodeParameter('dsId', 0) as string;
        if (!dsId) return [];

        // Supermetrics /query/accounts expects { ds_id } via ?json=
        const payload: IDataObject = { ds_id: dsId };

        const res = await this.helpers.httpRequestWithAuthentication!.call(this, 'supermetricsApi', {
            method: 'GET',
            url: 'https://api.supermetrics.com/enterprise/v2/query/accounts',
            json: true,
            qs: { json: JSON.stringify(payload) },
        });

        const out: INodePropertyOptions[] = [];
        for (const login of (res?.data ?? []) as any[]) {
            for (const acc of (login?.accounts ?? []) as any[]) {
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
