import { getVar } from '@/common/0.domain/utils/var'
import { type ApiDocumentationParams } from '@/common/2.presentation/documentation/api-documenter'
import { emailTakenSchema } from '@/common/2.presentation/documentation/schemas/email-taken-schema'
import { invalidPasswordSchema } from '@/common/2.presentation/documentation/schemas/invalid-password-schema'
import { invalidSchemaSchema } from '@/common/2.presentation/documentation/schemas/invalid-schema-schema'
import { invalidTokenSchema } from '@/common/2.presentation/documentation/schemas/invalid-token-schema'
import { missingTokenSchema } from '@/common/2.presentation/documentation/schemas/missing-token-schema'
import { notFoundSchema } from '@/common/2.presentation/documentation/schemas/not-found-schema'
import { passwordMismatchSchema } from '@/common/2.presentation/documentation/schemas/password-mismatch-schema'

import { userPaths, userSchemas } from '@/user/4.main/setup/webapp/user-api-specification'

export const apiDocumentationParams: ApiDocumentationParams = {
  info: {
    description: 'Nodejs Webapi template',
    title: 'webapi-nodejs',
    version: '1.0.0'
  },
  paths: {
    ...userPaths
  },
  schemas: {
    emailTakenSchema,
    invalidPasswordSchema,
    invalidSchemaSchema,
    invalidTokenSchema,
    missingTokenSchema,
    notFoundSchema,
    passwordMismatchSchema,
    ...userSchemas
  },
  servers: [{
    description: getVar('NODE_ENV'),
    url: '/api'
  }],
  tags: [{
    name: 'user'
  }]
}
