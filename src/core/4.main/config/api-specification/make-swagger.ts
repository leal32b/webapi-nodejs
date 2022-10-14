import { serve, setup } from 'swagger-ui-express'

const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'webapi-nodejs',
    description: 'Nodejs Webapi template',
    version: '1.0.0'
  }
}

export const makeSwagger = {
  path: '/api-docs',
  middlewares: [serve, setup(swaggerConfig)]
}
