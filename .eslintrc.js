module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: ['n8n-nodes-base'],
    extends: [
        'plugin:n8n-nodes-base/nodes',
        'plugin:n8n-nodes-base/community',
        'plugin:n8n-nodes-base/credentials',
    ],
    rules: {
        // optional custom tweaks, or overrides
    },
    ignores: [
        'dist/',
    ],};