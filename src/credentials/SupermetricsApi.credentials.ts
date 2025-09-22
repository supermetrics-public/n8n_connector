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
            displayName: 'Supermetrics API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            placeholder: 'api_....',
            description: 'Your Supermetrics API key. If you don\'t have a key, you can create one <a href="https://hub.supermetrics.com/api-key-management" target="blank">here</a>. Type should be "Query Key".',
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

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.supermetrics.com',
            url: '/query/fields?ds_id=FA',
        },
    };
}
