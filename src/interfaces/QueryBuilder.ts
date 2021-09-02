import { RxDocument } from 'rxdb'

interface QueryBuilderResult {
  query: string,
  variables: Record<string, RxDocument>[]
}

interface QueryBuilder {
  (doc: RxDocument): QueryBuilderResult
}

export default QueryBuilder