import { Either } from '@/core/0.domain/utils/either'
import { MiddlewareRequest } from '@/core/2.presentation/middleware/middleware'

export type SchemaValidatorResult = {
  isValid: boolean
  errors?: Object[]
}

export interface SchemaValidator {
  validate: (request: MiddlewareRequest, schema: Object) => Promise<Either<Error, SchemaValidatorResult>>
}
