# n8n-nodes-supermetrics

Supermetrics API node for n8n. Supports:

- Run Query (`Get data`) – sync or async, with optional auto-pagination (JSON output)
- Get Query Status
- Get Query Results
- List Fields
- List Accounts
- List Segments

## Requirements

- A valid Supermetrics API **license** and **API key**. Authentication is bearer token: `Authorization: Bearer <api key>`.  
  Docs: Authentication, Making requests.  
  https://supermetrics.com/docs/product-api-authentication  
  https://supermetrics.com/docs/product-api-making-requests

## Install (local development)

1. Start from the official starter (recommended):  
   Tutorial: https://docs.n8n.io/integrations/creating-nodes/build/programmatic-style-node/

2. Put this repo’s `credentials/` and `nodes/` contents into your starter project.

3. Build:
   ```bash
   npm i
   npm run build
