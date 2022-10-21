import { serve, setup } from 'swagger-ui-express'

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
    description: 'development'
  }],
  tags: [{
    name: 'user'
  }],
  paths: {
    '/user/sign-up': signUpPath
  },
  schemas: {
    ...userSchemas
  }
}

export const makeSwagger: ApiSpecification = {
  path: '/api-docs',
  middlewares: [serve, setup(swaggerConfig)]
}
