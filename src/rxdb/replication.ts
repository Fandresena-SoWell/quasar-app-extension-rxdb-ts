import {
  createRxDatabase,
  addRxPlugin,
  addPouchPlugin,
  getRxStoragePouch,
  RxDatabase,
  RxSchema,
  RxCollectionCreator,
  RxJsonSchema,
  RxCollection
} from 'rxdb'

import { Store, useStore } from "vuex"
import { inject } from "vue"
import { Notify } from "quasar"

import { PromptsInterface } from '../injects/prompts'
const prompts: PromptsInterface = require('../injects/prompts')
const i18n = require('../injects/i18n')
const {
  global: { t }
} = i18n()

const store = useStore()

import QueryBuilder from '../interfaces/queryBuilder'
import Dictionary from '../interfaces/Dictionary'

export default class RxDBExtension {
  private queryBuilders: QueryBuilder[]
  private schema: Dictionary<RxJsonSchema<any>>
  private x_hasura_role: string
  private localDB: RxDatabase<any>
  private collections: Dictionary<RxCollection> = {} // NOT SO SURE ABOUT THIS TYPING
  private collectionsName: string[] = []

  constructor(querys: QueryBuilder[], collectionSchema: Dictionary<RxJsonSchema<any>>, hasura_role: string) {
    this.queryBuilders = querys
    this.schema = collectionSchema
    this.x_hasura_role = hasura_role
  }

  public async createDB (): Promise<RxDatabase<any>> {
    const { vuex_getters_db_name } = prompts
    const name = store.getters[vuex_getters_db_name]
    if (name) {
      if (this.localDB === null) {
        console.log("DatabaseService: creating database..")
        const database = await createRxDatabase({
          name: `sw_${name}`,
          storage: getRxStoragePouch('idb'),
          ignoreDuplicate: true
        })
        console.log("DatabaseService: created database")

        // Add name and create collection
        const obj: Dictionary<RxCollectionCreator> = {}
        Object.entries(this.schema).forEach(async ([key, value]) => {
          obj[key] = {
            schema: value
          }
          this.collectionsName.push(key)
        })
        this.collections = await database.addCollections(obj)
        this.localDB = database
        return database
      } else {
        return this.localDB
      }
    } else {
      Notify.create({
        message: t("rxdb.createDbError"),
        position: "top",
        type: "negative",
        textColor: "white",
        badgeStyle: "display:none"
      })
      throw Error(t("rxdb.createDbError"))
    }
  }
}