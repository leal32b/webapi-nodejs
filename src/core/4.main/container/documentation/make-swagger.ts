import { serve, setup } from 'swagger-ui-express'

import { emailTakenSchema } from '@/core/3.infra/documentation/api-specification/schemas/email-taken-schema'
import { invalidSchemaSchema } from '@/core/3.infra/documentation/api-specification/schemas/invalid-schema-schema'
import { passwordMismatchSchema } from '@/core/3.infra/documentation/api-specification/schemas/password-mismatch-schema'
import { ApiSpecification } from '@/core/4.main/container/container-types'
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
    '/user/sign-up': signUpPath
  },
  schemas: {
    ...userSchemas,
    emailTakenSchema,
    invalidSchemaSchema,
    passwordMismatchSchema
  }
}

export const makeSwagger: ApiSpecification = {
  path: '/api-docs',
  middlewares: [serve, setup(swaggerConfig)]
}
