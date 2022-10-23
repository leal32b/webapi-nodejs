import { serve, setup } from 'swagger-ui-express'

import { emailTakenSchema } from '@/core/3.infra/documentation/api-specification/schemas/email-taken-schema'
import { invalidPasswordSchema } from '@/core/3.infra/documentation/api-specification/schemas/invalid-password-schema'
import { invalidSchemaSchema } from '@/core/3.infra/documentation/api-specification/schemas/invalid-schema-schema'
import { invalidTokenSchema } from '@/core/3.infra/documentation/api-specification/schemas/invalid-token-schema'
import { missingTokenSchema } from '@/core/3.infra/documentation/api-specification/schemas/missing-token-schema'
import { notFoundSchema } from '@/core/3.infra/documentation/api-specification/schemas/not-found-schema'
import { passwordMismatchSchema } from '@/core/3.infra/documentation/api-specification/schemas/password-mismatch-schema'
import { ApiSpecification } from '@/core/4.main/container/container-types'
import { userPaths, userSchemas } from '@/user/4.main/setup/user-api-specification'

const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'webapi-nodejs',
    description: 'Nodejs Webapi template',
    version: '1.0.0'
  },
  components: {
    securitySchemes: {
      accessToken: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  servers: [{
    url: '/api',
    description: process.env.NODE_ENV
  }],
  tags: [{
    name: 'user'
  }],
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
  }
}

export const makeSwagger: ApiSpecification = {
  path: '/api-docs',
  middlewares: [serve, setup(swaggerConfig)]
}
