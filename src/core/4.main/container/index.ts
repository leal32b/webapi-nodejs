import 'dotenv/config'

import { makeExpress } from '@/core/4.main/container/app/make-express'
import { App, Cryptography, Documentation, Persistence, Validators } from '@/core/4.main/container/container-types'
import { makeArgon } from '@/core/4.main/container/cryptography/make-argon'
import { makeJsonwebtoken } from '@/core/4.main/container/cryptography/make-jsonwebtoken'
import { makeSwagger } from '@/core/4.main/container/documentation/make-swagger'
import { makeMongodb } from '@/core/4.main/container/persistence/make-mongodb'
import { makePostgres } from '@/core/4.main/container/persistence/make-postgres'
import { makeAjv } from '@/core/4.main/container/validators/make-ajv'

const PERSISTENCE = process.env.PERSISTENCE

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
  actual: persistenceChoices[PERSISTENCE],
  ...persistenceChoices
}

export const validators: Validators = {
  schemaValidator: makeAjv
}
