import { type Middleware } from '@/core/2.presentation/middleware/middleware'
import { SchemaValidatorMiddleware } from '@/core/3.infra/api/middlewares/schema-validator-middleware'
import { validators } from '@/core/4.main/container'

export const schemaValidatorMiddleware: Middleware = SchemaValidatorMiddleware.create({
  schemaValidator: validators.schemaValidator
})
