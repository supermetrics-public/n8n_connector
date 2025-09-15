# n8n-nodes-supermetrics

Supermetrics node for n8n — use data from 50+ data sources like Facebook Ads or Google Analytics right inside your workflows (source list to be expanded to 200+ soon).

- List Data Sources - Lists the sources available via Supermetrics. For example, LinkedIn Ads and YouTube are data sources.
- List Fields - Lists the fields available for a data source. For example, some of the fields available for LinkedIn Ads are Campaign Name and Cost.
- List Accounts - Lists the accounts you have access to within a data source. Eg. for LinkedIn Ads, this lists your advertising accounts.
- Get Data - Runs a query for getting data fron the selected source, using your selection of accounts and fields, and possible other parameters such as the date range.

## Requirements

- A valid Supermetrics API **license** and **API key**. 
  Docs: Authentication, Making requests.  
- https://supermetrics.com/products/api
  https://supermetrics.com/docs/product-api-authentication

## Install (local development)

1. Start from the official starter (recommended):  
   Tutorial: https://docs.n8n.io/integrations/creating-nodes/build/programmatic-style-node/

2. Put this repo’s `credentials/` and `nodes/` contents into your starter project.

3. Build:
   ```bash
   npm i
   npm run build
