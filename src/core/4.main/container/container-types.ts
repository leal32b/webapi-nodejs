import { type EmailSender } from '@/communication/1.application/email/email-sender'
import { type TemplateCompiler } from '@/core/1.application/compilers/template-compiler'
import { type Encrypter } from '@/core/1.application/cryptography/encrypter'
import { type Hasher } from '@/core/1.application/cryptography/hasher'
import { type Translator } from '@/core/1.application/localization/translator'
import { type ApiDocumenter } from '@/core/2.presentation/documentation/api-documenter'
import { type SchemaValidator } from '@/core/2.presentation/validators/schema-validator'
import { type MongodbClient } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'
import { type PersistenceClient } from '@/core/3.infra/persistence/persistence-client'
import { type PostgresClient } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { type WebApp } from '@/core/3.infra/webapp/web-app'
import { type UserRepository } from '@/user/1.application/repositories/user-repository'

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
  apiDocumenter: ApiDocumenter
}

export type Localization = {
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
