import { Encrypter } from '@/core/1.application/cryptography/encrypter'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { WebApp } from '@/core/3.infra/api/app/web-app'
import { SchemaValidator } from '@/core/3.infra/api/validators/schema-validator'
import { ArgonAdapter } from '@/core/3.infra/cryptography/argon/argon-adapter'
import { JsonwebtokenAdapter } from '@/core/3.infra/cryptography/jsonwebtoken/jsonwebtoken-adapter'
import { AjvAdapter } from '@/core/3.infra/validators/ajv/ajv-adapter'
import { ExpressAdapter } from '@/core/3.infra/webapp/express/express-adapter'
import { UserRepository } from '@/user/1.application/repositories/user-repository'
import { PgUserRepository } from '@/user/3.infra/persistence/postgres/repositories/pg-user-repository'

type Cryptography = {
  encrypter: Encrypter
  hasher: Hasher
}

type Persistence = {
  userRepository: UserRepository
}

type Validators = {
  schemaValidator: SchemaValidator
}

type App = {
  webApp: WebApp
}

type Config = {
  cryptography: Cryptography
  persistence: Persistence
  validators: Validators
  app: App
}

export const config: Config = {
  cryptography: {
    encrypter: new JsonwebtokenAdapter(),
    hasher: new ArgonAdapter({ salt: 12 })
  },
  persistence: {
    userRepository: new PgUserRepository()
  },
  validators: {
    schemaValidator: new AjvAdapter()
  },
  app: {
    webApp: new ExpressAdapter()
  }
}
