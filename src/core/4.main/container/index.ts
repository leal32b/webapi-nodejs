import 'dotenv/config'

import { getVar } from '@/core/0.domain/utils/var'
import { makeExpress } from '@/core/4.main/container/app/make-express'
import { makeNodemailer } from '@/core/4.main/container/communication/make-nodemailer'
import { makeHandlebars } from '@/core/4.main/container/compilers/make-handlebars'
import {
  type Internationalization,
  type App,
  type Communication,
  type Compilers,
  type Cryptography,
  type Documentation,
  type Persistence,
  type Validators
} from '@/core/4.main/container/container-types'
import { makeArgon } from '@/core/4.main/container/cryptography/make-argon'
import { makeJsonwebtoken } from '@/core/4.main/container/cryptography/make-jsonwebtoken'
import { makeSwagger } from '@/core/4.main/container/documentation/make-swagger'
import { makeI18next } from '@/core/4.main/container/i18n/make-i18next'
import { makeMongodb } from '@/core/4.main/container/persistence/make-mongodb'
import { makePostgres } from '@/core/4.main/container/persistence/make-postgres'
import { makeAjv } from '@/core/4.main/container/validators/make-ajv'

export const app: App = {
  webApp: makeExpress
}

export const communication: Communication = {
  emailSender: makeNodemailer
}

export const compilers: Compilers = {
  templateCompiler: makeHandlebars
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

export const internationalization: Internationalization = {
  i18n: makeI18next
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

compilers.templateCompiler.registerHelper('i18n', (key: string, lng?: string): string => {
  return internationalization.i18n.t(key, { lng })
})
