import { DatabaseFactories } from '@/core/4.main/setup/factories'
import { PostgresUserFactory } from '@/user/3.infra/persistence/postgres/factories/postgres-user-factory'

export const makePostgresFactories: DatabaseFactories = {
  userFactory: PostgresUserFactory.create()
}