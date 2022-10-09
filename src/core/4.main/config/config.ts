import { Encrypter } from '@/core/1.application/cryptography/encrypter'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { WebApp } from '@/core/3.infra/api/app/web-app'
import { SchemaValidator } from '@/core/3.infra/api/validators/schema-validator'
import { ArgonAdapter } from '@/core/3.infra/cryptography/argon/argon-adapter'
import { JsonwebtokenAdapter } from '@/core/3.infra/cryptography/jsonwebtoken/jsonwebtoken-adapter'
import { AjvAdapter } from '@/core/3.infra/validators/ajv/ajv-adapter'
import { ExpressAdapter } from '@/core/3.infra/webapp/express/express-adapter'
import { persistence } from '@/core/4.main/config/persistence'
import { UserRepository } from '@/user/1.application/repositories/user-repository'

type App = {
  webApp: WebApp
}

type Cryptography = {
  encrypter: Encrypter
  hasher: Hasher
}

export type Persistence = {
  connect: Function
  clear: Function
  close: Function
  repositories: {
    userRepository: UserRepository
  }
}

type Validators = {
  schemaValidator: SchemaValidator
}

type Config = {
  app: App
  cryptography: Cryptography
  persistence: Persistence
  validators: Validators
}

export const config: Config = {
  persistence,
  cryptography: {
    encrypter: new JsonwebtokenAdapter(),
    hasher: new ArgonAdapter({ salt: 12 })
  },
  validators: {
    schemaValidator: new AjvAdapter()
  },
  app: {
    webApp: new ExpressAdapter()
  }
}
