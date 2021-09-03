import {
  createRxDatabase,
  getRxStoragePouch,
  RxDatabase,
  RxCollectionCreator,
  RxJsonSchema,
  RxCollection
} from 'rxdb'

import { Store, useStore } from 'vuex'
import { Notify } from 'quasar'

import QueryBuilder from '../interfaces/QueryBuilder'
import Dictionary from '../interfaces/Dictionary'

import i18n from '../injects/i18n'
const {
  global: { t }
} = i18n()

import prompts from '../injects/prompts'

const store: Store<unknown> = useStore()

export class RxDBExtension {
  private queryBuilders: QueryBuilder[]
  private schema: Dictionary<RxJsonSchema<unknown>>
  private x_hasura_role: string
  private localDB?: RxDatabase<Dictionary<RxCollection>>
  private collections: Dictionary<RxCollection> = {} // NOT SO SURE ABOUT THIS TYPING
  private collectionsName: string[] = []

  constructor(querys: QueryBuilder[], collectionSchema: Dictionary<RxJsonSchema<unknown>>, hasura_role: string) {
    this.queryBuilders = querys
    this.schema = collectionSchema
    this.x_hasura_role = hasura_role
  }

  public async createDB (): Promise<RxDatabase> {
    const { vuex_getters_db_name } = prompts()
    // eslint-disable-next-line
    const name: string = store.getters[vuex_getters_db_name]
    if (name) {
      if (this.localDB === undefined) {
        console.log('DatabaseService: creating database..')
        const database = await createRxDatabase({
          name: `sw_${name}`,
          storage: getRxStoragePouch('idb'),
          ignoreDuplicate: true
        })
        console.log('DatabaseService: created database')

        // Add name and create collection
        const collections: Dictionary<RxCollectionCreator> = {}
        Object.entries(this.schema).forEach(([key, value]) => {
          collections[key] = {
            schema: value
          }
          this.collectionsName.push(key)
        })
        this.collections = await database.addCollections(collections)
        this.localDB = database
      }
      return this.localDB
    } else {
      Notify.create({
        message: t('rxdb.createDbError'),
        position: 'top',
        type: 'negative',
        textColor: 'white',
        badgeStyle: 'display:none'
      })
      throw Error(t('rxdb.createDbError'))
    }
  }
}

// We use a SingletonFactory to make sure we only have one instance of the RxDBExtension running
export default class RxDBExtensionSingletonFactory {
  private static instance: RxDBExtension

  public static getInstance(querys: QueryBuilder[], collectionSchema: Dictionary<RxJsonSchema<unknown>>, hasura_role: string): RxDBExtension {
    if (!RxDBExtensionSingletonFactory.instance) {
      RxDBExtensionSingletonFactory.instance = new RxDBExtension(querys, collectionSchema, hasura_role)
    }

    return RxDBExtensionSingletonFactory.instance
  }
}