import {
  createRxDatabase,
  getRxStoragePouch,
  RxDatabase,
  RxCollectionCreator,
  RxJsonSchema,
  RxCollection
} from 'rxdb'

import { useStore } from "vuex"
import { Notify } from "quasar"

import QueryBuilder from '../interfaces/queryBuilder'
import Dictionary from '../interfaces/Dictionary'
import PromptsInterface from '../interfaces/PromptsInterface'

const i18n = require('../injects/i18n')
const {
  global: { t }
} = i18n()

const prompts: () => PromptsInterface = require('../injects/prompts')

const store = useStore()


export default class RxDBExtension {
  private queryBuilders: QueryBuilder[]
  private schema: Dictionary<RxJsonSchema<any>>
  private x_hasura_role: string
  private localDB?: RxDatabase<Dictionary<RxCollection>>
  private collections: Dictionary<RxCollection> = {} // NOT SO SURE ABOUT THIS TYPING
  private collectionsName: string[] = []

  constructor(querys: QueryBuilder[], collectionSchema: Dictionary<RxJsonSchema<any>>, hasura_role: string) {
    this.queryBuilders = querys
    this.schema = collectionSchema
    this.x_hasura_role = hasura_role
  }

  public async createDB (): Promise<RxDatabase<any>> {
    const { vuex_getters_db_name } = prompts()
    const name = store.getters[vuex_getters_db_name]
    if (name) {
      if (this.localDB === undefined) {
        console.log("DatabaseService: creating database..")
        const database = await createRxDatabase({
          name: `sw_${name}`,
          storage: getRxStoragePouch('idb'),
          ignoreDuplicate: true
        })
        console.log("DatabaseService: created database")

        // Add name and create collection
        const collections: Dictionary<RxCollectionCreator> = {}
        Object.entries(this.schema).forEach(async ([key, value]) => {
          collections[key] = {
            schema: value
          }
          this.collectionsName.push(key)
        })
        this.collections = await database.addCollections(collections)
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

  public getDB (): RxDatabase {
    if (this.localDB !== undefined) {
      return this.localDB
    } else {
      Notify.create({
        message: t("rxdb.getDBError"),
        position: "top",
        type: "negative",
        textColor: "white",
        badgeStyle: "display:none"
      })
      throw Error(t("rxdb.getDBError"))
    }
  }

  public getCollection (name?: string): RxCollection | undefined {
    if (name !== undefined) {
      if (name !== null && this.collections.hasOwnProperty(name)) {
        const collection = this.collections[name]
        return collection
      } else {
        Notify.create({
          message: t("rxdb.getCollectionError"),
          position: "top",
          type: "negative",
          textColor: "white",
          badgeStyle: "display:none"
        })
        throw Error(t("rxdb.getCollectionError"))
      }
    }
  }
}