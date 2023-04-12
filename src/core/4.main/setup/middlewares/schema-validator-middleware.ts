import { type Middleware } from '@/core/1.application/middleware/middleware'
import { SchemaValidatorMiddleware } from '@/core/2.presentation/middlewares/schema-validator-middleware'
import { validators } from '@/core/4.main/container'

export const schemaValidatorMiddleware: Middleware = SchemaValidatorMiddleware.create({
  schemaValidator: validators.schemaValidator
})
