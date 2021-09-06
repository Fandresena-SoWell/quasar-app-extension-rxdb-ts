import { Notify } from 'quasar'
import { RxGraphQLReplicationQueryBuilder } from 'rxdb'
import { RxGraphQLReplicationState } from 'rxdb/dist/types/plugins/replication-graphql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { I18n } from 'vue-i18n'
import Dictionary from '../interfaces/Dictionary'
import { QueryBuilder } from '../interfaces/QueryBuilder'

interface Query {
  pushQueryBuilder: RxGraphQLReplicationQueryBuilder,
  pullQueryBuilder: RxGraphQLReplicationQueryBuilder,
  subQuery: string
}

export const setupQuery = (queryBuilders: Dictionary<QueryBuilder>, collectionName: string): Query => {
  // eslint-disable-next-line no-unused-vars
  const queryBuilder = queryBuilders[collectionName]
  const pushQueryBuilder = queryBuilder.push
  const pullQueryBuilder = queryBuilder.pull
  const subQuery = queryBuilder.sub
  return { pushQueryBuilder, pullQueryBuilder, subQuery }
}

export const subscribe = (replicationState: RxGraphQLReplicationState<unknown>, query: string, wsClient: SubscriptionClient, i18n: I18n): void => {
  const changeObservable = wsClient.request({ query })
  changeObservable.subscribe({
    // eslint-disable-next-line no-unused-vars
    next: async (): Promise<void> => {
      console.log('subscription emitted => trigger run')
      await replicationState.run()
    },
    error(error) {
      const err = error.message.split('JWT:')
      const message = err.length ? `${err[1]} Please reconnect` : 'Please reconnect'
      Notify.create({
        message: message,
        position: 'top',
        type: 'negative',
        textColor: 'white',
        badgeStyle: 'display:none',
        timeout: 10000
      })
      throw error
    }
  })
  // Error log
  replicationState.error$.subscribe((err) => {
    Notify.create({
      message: i18n.global.t('rxdb.subscribeError'),
      position: 'top',
      icon: 'warning',
      type: 'warning',
      textColor: 'white',
      badgeStyle: 'display:none'
    })
    throw err
  })
}