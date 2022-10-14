import { Persistence } from '@/core/4.main/config/config'
import { mongodbPersistence } from '@/core/4.main/config/persistence/databases/mongodb-persistence'
import { postgresPersistence } from '@/core/4.main/config/persistence/databases/postgres-persistence'

const DATABASE = process.env.DATABASE

const _persistence: { [key: string]: Persistence } = {
  mongodb: mongodbPersistence,
  postgres: postgresPersistence
}

export const persistence = _persistence[DATABASE]
