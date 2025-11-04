import typescriptParser from '@typescript-eslint/parser';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';

export default [
    {
        ignores: ['dist/'],
    },
    {
        files: ['**/*.ts', '**/*.js'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        plugins: {
            'n8n-nodes-base': n8nNodesBase,
        },
        rules: {
            ...n8nNodesBase.configs.nodes.rules,
            ...n8nNodesBase.configs.community.rules,
            ...n8nNodesBase.configs.credentials.rules,
            // optional custom tweaks, or overrides
        },
    },
];
