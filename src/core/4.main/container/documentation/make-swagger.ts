import { serve, setup } from 'swagger-ui-express'

import { emailTakenSchema } from '@/core/3.infra/documentation/api-specification/schemas/email-taken-schema'
import { invalidPasswordSchema } from '@/core/3.infra/documentation/api-specification/schemas/invalid-password-schema'
import { invalidSchemaSchema } from '@/core/3.infra/documentation/api-specification/schemas/invalid-schema-schema'
import { notFoundSchema } from '@/core/3.infra/documentation/api-specification/schemas/not-found-schema'
import { passwordMismatchSchema } from '@/core/3.infra/documentation/api-specification/schemas/password-mismatch-schema'
import { ApiSpecification } from '@/core/4.main/container/container-types'
import { signInPath } from '@/user/3.infra/api/routes/sign-in/sign-in-path'
import { signUpPath } from '@/user/3.infra/api/routes/sign-up/sign-up-path'
import { userSchemas } from '@/user/4.main/setup/user-schemas'

const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'webapi-nodejs',
    description: 'Nodejs Webapi template',
    version: '1.0.0'
  },
  servers: [{
    url: '/api',
    description: process.env.NODE_ENV
  }],
  tags: [{
    name: 'user'
  }],
  paths: {
    ...signUpPath,
    ...signInPath
  },
  schemas: {
    ...userSchemas,
    emailTakenSchema,
    invalidSchemaSchema,
    passwordMismatchSchema,
    invalidPasswordSchema,
    notFoundSchema
  }
}

export const makeSwagger: ApiSpecification = {
  path: '/api-docs',
  middlewares: [serve, setup(swaggerConfig)]
}
