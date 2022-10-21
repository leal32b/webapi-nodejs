import { Middleware } from '@/core/2.presentation/middleware/middleware'
import { SchemaValidatorMiddleware } from '@/core/3.infra/api/middlewares/schema-validator-middleware'
import { validators } from '@/core/4.main/config'

export const schemaValidatorMiddlewareFactory = (): Middleware => {
  return new SchemaValidatorMiddleware({ schemaValidator: validators.schemaValidator })
}
