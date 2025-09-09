import { VersionedNodeType,INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { SupermetricsV1 } from './v1/SupermetricsV1.node';

export class Supermetrics extends VersionedNodeType {
    constructor() {
        const baseDescription: INodeTypeBaseDescription = {
            displayName: 'Supermetrics',
            name: 'supermetrics',
            icon: 'file:smicon.svg',
            group: ['transform'],
            description: 'Query marketing data using Supermetrics',
            defaultVersion: 1,
        };

        const nodeVersions: IVersionedNodeType['nodeVersions'] = {
            1: new SupermetricsV1(baseDescription),
        };

        super(nodeVersions, baseDescription);
    }
}
