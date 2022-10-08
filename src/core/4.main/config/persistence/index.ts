import { Persistence } from '@/core/4.main/config/config'
import { mongodbPersistence } from '@/core/4.main/config/persistence/mongodb-persistence'
import { postgresPersistence } from '@/core/4.main/config/persistence/postgres-persistence'

const DATABASE = process.env.DATABASE

const _persistence: { [key: string]: Persistence } = {
  postgres: postgresPersistence,
  mongodb: mongodbPersistence
}

export const persistence = _persistence[DATABASE]
