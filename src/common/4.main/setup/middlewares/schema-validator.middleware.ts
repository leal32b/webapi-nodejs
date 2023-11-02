import { type Middleware } from '@/common/1.application/middleware/middleware'
import { SchemaValidatorMiddleware } from '@/common/2.presentation/middlewares/schema-validator.middleware'
import { validation } from '@/common/4.main/container'

export const schemaValidatorMiddleware: Middleware = SchemaValidatorMiddleware.create({
  schemaValidator: validation.schemaValidator
})
