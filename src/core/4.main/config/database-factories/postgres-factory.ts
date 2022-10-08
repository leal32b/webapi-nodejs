import { DatabaseFactories } from '@/core/4.main/config/database-factories'
import { PgUserFactory } from '@/user/3.infra/persistence/postgres/factories/user-factory'

export const postgresFactories: DatabaseFactories = {
  userFactory: PgUserFactory.create()
}
