import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject } from 'n8n-workflow';
import { supermetricsGetRequest } from './functions';
import {ALLOWED_DATA_SOURCE_IDS} from './constants';


type context = IExecuteFunctions | ILoadOptionsFunctions;

/** Fetch raw list from Supermetrics (no auth) */
export async function fetchDataSources(this: context) {

    const res = await this.helpers.httpRequest({
        method: 'GET',
        url: 'https://api.supermetrics.com/datasource/search?system=n8n',
        json: true,
    });
    const list = res?.data?.list ?? [];
    return list.filter((ds: any) => ALLOWED_DATA_SOURCE_IDS.has(ds.id));
}

export async function fetchFields(this: context, ds_id: string) {
    const res = await supermetricsGetRequest.call(this, '/query/fields', { ds_id: ds_id } as IDataObject);
    return res?.data ?? [];
}

export async function fetchAccounts(this: context, ds_id: string) {
    const res = await supermetricsGetRequest.call(this, '/query/accounts', { ds_id: ds_id } as IDataObject);
    return res?.data ?? [];
}
