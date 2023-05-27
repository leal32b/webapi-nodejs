import Ajv, { type ErrorObject } from 'ajv'

import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type MiddlewareRequest } from '@/common/1.application/middleware/middleware'
import { type SchemaValidator, type SchemaValidatorResult } from '@/common/2.presentation/validation/schema-validator'

export class AjvAdapter implements SchemaValidator {
  private constructor () {}

  public static create (): AjvAdapter {
    return new AjvAdapter()
  }

  public async validate (request: MiddlewareRequest, schema: Record<string, unknown>): Promise<Either<ErrorObject, SchemaValidatorResult>> {
    try {
      const ajv = new Ajv()
      const validate = ajv.compile(schema)
      const isValid = validate(request.payload)

      if (isValid) {
        return right({ isValid })
      }

      return right({
        errors: validate.errors,
        isValid
      })
    } catch (error) {
      return left(error)
    }
  }
}
