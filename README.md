
# Quasar App Extension rxdb-ts  

A Quasar App extension for RxDB integration, with TS support

  

## Install

```bash

quasar ext add @SoWell/rxdb-ts

```

Quasar CLI will retrieve it from the NPM registry and install the extension to your project.

  

### Prompts

``` js
[
	{
		name:  'server_graphql_base_url',
		message:  'URL for Graphql server',
		default:  'http://localhost'
	},
	{
		name:  'server_graphql_base_url_subscription',
		message:  'URL for Graphql subscription',
		default:  'wss://localhost'
	},
	{
		name:  'vuex_getters_token',
		message:  'Vuex getter token information',
		default:  'rxdb/getToken'
	},
	{
		name:  'vuex_getters_db_name',
		message:  'Vuex getter db name information',
		default:  'rxdb/getDbName'
	}
]
```

  

## Uninstall

```bash

quasar ext remove @SoWell/rxdb-ts

```

  

## API
```js
const  rxDBExtension = RxDBExtensionSingletonFactory.getInstance(querys, schema, hasura_role)

  

// create the local database
await  rxDBExtension.createDatabase()

// get the localDatabase instance
const  db = rxDBExtension.getDB()

// get collection by name
const  collection = rxDBExtension.getCollection(name)

// start data replication from Hasura to RxDB
rxDBExtension.initReplication()

// stop data replication
rxDBExtension.stopReplication()
```