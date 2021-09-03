import { RxGraphQLReplicationQueryBuilder } from 'rxdb'

export interface QueryBuilder {
  push: RxGraphQLReplicationQueryBuilder,
  pull: RxGraphQLReplicationQueryBuilder,
  sub: string
}
