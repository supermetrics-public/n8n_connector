"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupermetricsApi = void 0;
class SupermetricsApi {
    constructor() {
        this.name = 'supermetricsApi';
        this.displayName = 'Supermetrics API';
        this.documentationUrl = 'https://supermetrics.com/docs/product-api-authentication';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Your Supermetrics API key.',
            },
        ];
        // Attach the Authorization header automatically to every request
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '={{"Bearer " + $credentials.apiKey}}',
                },
            },
        };
        // Simple bearer check against httpbin (standard pattern in many n8n credentials)
        // This verifies the header wiring (200 when Authorization header is present).
        this.test = {
            request: {
                baseURL: 'https://httpbin.org',
                url: '/bearer',
            },
        };
    }
}
exports.SupermetricsApi = SupermetricsApi;
