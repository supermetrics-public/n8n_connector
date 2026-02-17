import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject } from 'n8n-workflow';
import { supermetricsGetRequest } from './functions';
import {ALLOWED_DATA_SOURCE_IDS, USER_AGENT} from './constants';


type ApiContext = IExecuteFunctions | ILoadOptionsFunctions;

/** Fetch raw list from Supermetrics (no auth) */
export async function fetchDataSources(this: ApiContext): Promise<IDataObject[]> {

    const res = await this.helpers.httpRequest({
        method: 'GET',
        url: 'https://api.supermetrics.com/datasource/search?system=n8n',
        headers: {
            'User-Agent': USER_AGENT,
        },
        json: true,
    });
    const list = (res?.data?.list ?? []) as IDataObject[];
    return list.filter((ds: IDataObject) => ALLOWED_DATA_SOURCE_IDS.has(ds.id as string));
}

export async function fetchFields(this: ApiContext, ds_id: string): Promise<IDataObject[]> {
    const res = await supermetricsGetRequest.call(this, '/query/fields', { ds_id } as IDataObject);
    return (res?.data ?? []) as IDataObject[];
}

export async function fetchAccounts(this: ApiContext, ds_id: string): Promise<IDataObject[]> {
    const res = await supermetricsGetRequest.call(this, '/query/accounts', { ds_id } as IDataObject);
    return (res?.data ?? []) as IDataObject[];
}
