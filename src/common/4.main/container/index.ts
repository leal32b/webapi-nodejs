import 'dotenv/config'

import { getVar } from '@/common/0.domain/utils/var'
import { makeNodemailer } from '@/common/4.main/container/communication/make-nodemailer'
import { makeHandlebars } from '@/common/4.main/container/compilers/make-handlebars'
import {
  type App,
  type Communication,
  type Compilers,
  type Cryptography,
  type Documentation,
  type Persistence,
  type Validators,
  type Localization
} from '@/common/4.main/container/container-types'
import { makeArgon } from '@/common/4.main/container/cryptography/make-argon'
import { makeJsonwebtoken } from '@/common/4.main/container/cryptography/make-jsonwebtoken'
import { makeSwagger } from '@/common/4.main/container/documentation/make-swagger'
import { makeI18next } from '@/common/4.main/container/localization/make-i18next'
import { makeMongodb } from '@/common/4.main/container/persistence/make-mongodb'
import { makePostgres } from '@/common/4.main/container/persistence/make-postgres'
import { makeAjv } from '@/common/4.main/container/validators/make-ajv'
import { makeExpress } from '@/common/4.main/container/webapp/make-express'

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
  apiDocumenter: makeSwagger
}

export const localization: Localization = {
  translator: makeI18next
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
  return localization.translator.t(key, { lng })
})
