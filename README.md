Quasar App Extension rxdb-ts
===

_Be sure to change this readme as appropriate for your app extension._

_Think about the organization of this file and how the information will be beneficial to the user._

> Add a short description of your App Extension. What does it do? How is it beneficial? Why would someone want to use it?

A Quasar App extension for RxDB integration, with TS support

# Install
```bash
quasar ext add rxdb-ts
```
Quasar CLI will retrieve it from the NPM registry and install the extension to your project.

## Prompts

> Explain the prompts here

# Uninstall
```bash
quasar ext remove @SoWell/rxdb-ts
```

# Info
> Add longer information here that will help the user of your app extension.

# Other Info
> Add other information that's not as important to know

# Donate
If you appreciate the work that went into this App Extension, please consider [donating to Quasar](https://donate.quasar.dev).

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