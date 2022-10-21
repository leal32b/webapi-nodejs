import 'dotenv/config'

import { makeExpress } from '@/core/4.main/config/app/make-express'
import { makeArgon } from '@/core/4.main/config/cryptography/make-argon'
import { makeJsonwebtoken } from '@/core/4.main/config/cryptography/make-jsonwebtoken'
import { makeSwagger } from '@/core/4.main/config/documentation/make-swagger'
import { makeMongodb } from '@/core/4.main/config/persistence/make-mongodb'
import { makePostgres } from '@/core/4.main/config/persistence/make-postgres'
import { App, Cryptography, Documentation, Persistence, Validators } from '@/core/4.main/config/types'
import { makeAjv } from '@/core/4.main/config/validators/make-ajv'

const DATABASE = process.env.DATABASE

export const app: App = {
  webApp: makeExpress
}

export const cryptography: Cryptography = {
  encrypter: makeJsonwebtoken,
  hasher: makeArgon
}

export const documentation: Documentation = {
  apiSpecification: {
    middlewares: makeSwagger.middlewares,
    path: makeSwagger.path
  }
}

const persistenceChoices = {
  mongodb: makeMongodb,
  postgres: makePostgres
}

export const persistence: Persistence = {
  actual: persistenceChoices[DATABASE],
  ...persistenceChoices
}

export const validators: Validators = {
  schemaValidator: makeAjv
}
