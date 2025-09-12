import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject } from 'n8n-workflow';
import { supermetricsGetRequest } from './functions';


type Ctx = IExecuteFunctions | ILoadOptionsFunctions;

// For now, only allow data sources that have an account list and don't have user-facing report types
export const ALLOWED_SOURCE_IDS = new Set([
    'AC','ADA','ADF','ADM','ADR','ASA','ASC','AW','BQ','BW','CRI','DBM','DFA','DFP','DFS','FA',
    'FAN','FB','GAWA','GMB','GW','HS','IGI','KLAV','LIA','LIP','MARK','MC','MFSC','MGO','OBA',
    'OPT','PIA','QA','SCM','SF','SFMC','SFP','SFPS','SHP','STAC','TA','TEST','TIK','TTD','VDSP',
    'WOO','YAD','YAM','YG','YT',
]);

/** Fetch raw list from Supermetrics (no auth) */
export async function fetchDataSources(this: Ctx) {

    const res = await this.helpers.httpRequest({
        method: 'GET',
        url: 'https://api.supermetrics.com/datasource/search',
        json: true,
    });
    const list = res?.data?.list ?? [];
    return list.filter((ds: any) => ALLOWED_SOURCE_IDS.has(ds.id));
}

export async function fetchFields(this: Ctx, dsId: string) {
    const res = await supermetricsGetRequest.call(this, '/query/fields', { ds_id: dsId } as IDataObject);
    return res?.data ?? [];
}

export async function fetchAccounts(this: Ctx, dsId: string) {
    const res = await supermetricsGetRequest.call(this, '/query/accounts', { ds_id: dsId } as IDataObject);
    return res?.data ?? [];
}
