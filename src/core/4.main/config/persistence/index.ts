import { makeMongodb } from '@/core/4.main/config/persistence/make-mongodb'
import { makePostgres } from '@/core/4.main/config/persistence/make-postgres'
import { UserRepository } from '@/user/1.application/repositories/user-repository'

export type Persistence = {
  connect: Function
  clear: Function
  close: Function
  repositories: {
    userRepository: UserRepository
  }
}

const DATABASE = process.env.DATABASE

const _persistence: { [key: string]: Persistence } = {
  mongodb: makeMongodb,
  postgres: makePostgres
}

export const persistence: Persistence = _persistence[DATABASE]
