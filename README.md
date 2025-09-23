# n8n-nodes-supermetrics

Supermetrics node for n8n — use data from 50+ data sources like Facebook Ads or Google Analytics right inside your workflows (source list to be expanded to 200+ soon).

- List Data Sources - Lists the sources available via Supermetrics. For example, LinkedIn Ads and YouTube are data sources.
- List Fields - Lists the fields available for a data source. For example, some of the fields available for LinkedIn Ads are Campaign Name and Cost.
- List Accounts - Lists the accounts you have access to within a data source. Eg. for LinkedIn Ads, this lists your advertising accounts.
- Get Data - Runs a query for getting data fron the selected source, using your selection of accounts and fields, and possible other parameters such as the date range.

## Requirements

- A valid Supermetrics API **license** and **API key**.
- https://supermetrics.com/products/api
  https://supermetrics.com/docs/product-api-authentication

## Installation - n8n Cloud

We are waiting for n8n to verify our node. Before then, it cannot be installed to the cloud version of n8n.

## Installation - Self-hosted n8n (GUI — easiest)

If you run n8n yourself (local, desktop, server, or Docker) you can install the Supermetrics node in the UI:

Open n8n → Settings → Community Nodes → Install.

Enter the npm package name: "n8n-nodes-supermetrics"

(Optionally pin a version, e.g. @1.2.3.)

Confirm the risks prompt and click Install.

Restart n8n if prompted.
n8n Docs

Note that installing from npm via the GUI is only available to self-hosted instance owners/admins.

## Installation - Self-hosted n8n (Docker/CLI — manual)

Use this when the GUI isn’t available (e.g. queue mode) or for private/automated setups:

Enter the container shell (replace n8n with your container name):

    docker exec -it n8n sh

Create the nodes folder (if needed) and go there:

    mkdir -p ~/.n8n/nodes
    cd ~/.n8n/nodes


Install the package from npm:

    npm i n8n-nodes-supermetrics

Restart n8n so it loads the new node.
