import 'dotenv/config'

import { getVar } from '@/core/0.domain/utils/var'
import { makeExpress } from '@/core/4.main/container/app/make-express'
import { makeNodemailer } from '@/core/4.main/container/communication/make-nodemailer'
import { App, Communication, Cryptography, Documentation, Persistence, Validators } from '@/core/4.main/container/container-types'
import { makeArgon } from '@/core/4.main/container/cryptography/make-argon'
import { makeJsonwebtoken } from '@/core/4.main/container/cryptography/make-jsonwebtoken'
import { makeSwagger } from '@/core/4.main/container/documentation/make-swagger'
import { makeMongodb } from '@/core/4.main/container/persistence/make-mongodb'
import { makePostgres } from '@/core/4.main/container/persistence/make-postgres'
import { makeAjv } from '@/core/4.main/container/validators/make-ajv'

export const app: App = {
  webApp: makeExpress
}

export const communication: Communication = {
  emailSender: makeNodemailer
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
  actual: persistenceChoices[getVar('PERSISTENCE')],
  ...persistenceChoices
}

export const validators: Validators = {
  schemaValidator: makeAjv
}
