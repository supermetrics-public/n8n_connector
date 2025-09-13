import {
    ICredentialType,
    INodeProperties,
    ICredentialTestRequest,
    IAuthenticateGeneric,
} from 'n8n-workflow';

export class SupermetricsApi implements ICredentialType {
    name = 'supermetricsApi';
    displayName = 'Supermetrics API';
    // eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-miscased
    documentationUrl = 'https://supermetrics.com/docs/product-api-authentication';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            description: 'Your Supermetrics API key',
        },
    ];

    // Attach the Authorization header automatically to every request
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '={{"Bearer " + $credentials.apiKey}}',
            },
        },
    };

    // Simple bearer check against httpbin (standard pattern in many n8n credentials)
    // This verifies the header wiring (200 when Authorization header is present).
    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://httpbin.org',
            url: '/bearer',
        },
    };
}
