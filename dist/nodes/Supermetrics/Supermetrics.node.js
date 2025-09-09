"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supermetrics = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const SupermetricsV1_node_1 = require("./v1/SupermetricsV1.node");
class Supermetrics extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'Supermetrics',
            name: 'supermetrics',
            icon: 'file:smicon.svg',
            group: ['transform'],
            description: 'Query marketing data using Supermetrics',
            defaultVersion: 1,
        };
        const nodeVersions = {
            1: new SupermetricsV1_node_1.SupermetricsV1(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.Supermetrics = Supermetrics;
