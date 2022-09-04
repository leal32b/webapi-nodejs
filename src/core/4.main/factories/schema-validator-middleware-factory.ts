import { Middleware } from '@/core/2.presentation/middleware/middleware'
import { SchemaValidatorMiddleware } from '@/core/3.infra/api/middlewares/schema-validator-middleware'
import { config } from '@/core/4.main/config/config'

export const schemaValidatorMiddlewareFactory = (): Middleware => {
  return new SchemaValidatorMiddleware({ schemaValidator: config.validators.schemaValidator })
}
