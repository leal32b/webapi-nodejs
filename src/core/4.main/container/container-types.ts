import { type EmailSender } from '@/communication/1.application/email/email-sender'
import { type TemplateCompiler } from '@/core/1.application/compilers/template-compiler'
import { type Encrypter } from '@/core/1.application/cryptography/encrypter'
import { type Hasher } from '@/core/1.application/cryptography/hasher'
import { type Translator } from '@/core/1.application/i18n/translator'
import { type WebApp } from '@/core/3.infra/api/app/web-app'
import { type SchemaValidator } from '@/core/3.infra/api/validators/schema-validator'
import { type MongodbClient } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'
import { type PersistenceClient } from '@/core/3.infra/persistence/persistence-client'
import { type PostgresClient } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { type UserRepository } from '@/user/1.application/repositories/user-repository'

export type ApiSpecification = {
  path: string
  middlewares: any[]
}

export type App = {
  webApp: WebApp
}

export type Communication = {
  emailSender: EmailSender
}

export type Compilers = {
  templateCompiler: TemplateCompiler
}

export type Cryptography = {
  encrypter: Encrypter
  hasher: Hasher
}

export type Documentation = {
  apiSpecification: ApiSpecification
}

export type I18n = {
  translator: Translator
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
