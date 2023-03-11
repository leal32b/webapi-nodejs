import { type ErrorObject } from 'ajv'

import { type Either } from '@/core/0.domain/utils/either'
import { type MiddlewareRequest } from '@/core/2.presentation/middleware/middleware'

export type SchemaValidatorResult = {
  isValid: boolean
  errors?: Array<ErrorObject<string, Record<string, any>, unknown>>
}

export interface SchemaValidator {
  validate: (request: MiddlewareRequest, schema: Record<string, unknown>) => Promise<Either<Error, SchemaValidatorResult>>
}
