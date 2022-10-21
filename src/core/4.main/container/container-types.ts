import { Encrypter } from '@/core/1.application/cryptography/encrypter'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { WebApp } from '@/core/3.infra/api/app/web-app'
import { SchemaValidator } from '@/core/3.infra/api/validators/schema-validator'
import { MongodbClient } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'
import { PersistenceClient } from '@/core/3.infra/persistence/persistence-client'
import { PostgresClient } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { UserRepository } from '@/user/1.application/repositories/user-repository'

export type ApiSpecification = {
  path: string
  middlewares: any[]
}

export type App = {
  webApp: WebApp
}

export type Cryptography = {
  encrypter: Encrypter
  hasher: Hasher
}

export type Documentation = {
  apiSpecification: ApiSpecification
}

export type Mongodb = {
  client: MongodbClient
  repositories: Repositories
}

export type Postgres = {
  client: PostgresClient
  repositories: Repositories
}

export type Persistence = {
  actual: {
    client: PersistenceClient
    repositories: Repositories
  }
  mongodb: Mongodb
  postgres: Postgres
}

export type Repositories = {
  userRepository: UserRepository
}

export type Validators = {
  schemaValidator: SchemaValidator
}
