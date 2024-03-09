import { type TemplateCompiler } from '@/common/1.application/compilation/template-compiler'
import { type Encrypter } from '@/common/1.application/cryptography/encrypter'
import { type Hasher } from '@/common/1.application/cryptography/hasher'
import { type Translator } from '@/common/1.application/localization/translator'
import { type ApiDocumenter } from '@/common/2.presentation/documentation/api-documenter'
import { type SchemaValidator } from '@/common/2.presentation/validation/schema-validator'
import { type PersistenceClient } from '@/common/3.infra/persistence/persistence.client'
import { type PostgresClient } from '@/common/3.infra/persistence/postgres/client/postgres.client'
import { type WebApp } from '@/common/3.infra/webapp/web-app'

import { type EmailSender } from '@/communication/1.application/email/email-sender'
import { type GroupRepository } from '@/identity/1.application/repositories/group.repository'
import { type UserRepository } from '@/identity/1.application/repositories/user.repository'

export type App = {
  webApp: WebApp
}

export type Communication = {
  emailSender: EmailSender
}

export type Compilation = {
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

export type Postgres = {
  client: PostgresClient
  repositories: Repositories
}

export type Persistence = {
  actual: {
    client: PersistenceClient
    repositories: Repositories
  }
  postgres: Postgres
}

export type Repositories = {
  groupRepository: GroupRepository
  userRepository: UserRepository
}

export type Validation = {
  schemaValidator: SchemaValidator
}
