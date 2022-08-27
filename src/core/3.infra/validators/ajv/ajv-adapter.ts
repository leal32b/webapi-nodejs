
import Ajv from 'ajv'

import { Either, left, right } from '@/core/0.domain/utils/either'
import { MiddlewareRequest } from '@/core/2.presentation/middleware/middleware'
import { SchemaValidator, SchemaValidatorResult } from '@/core/3.infra/api/validators/schema-validator'

export class AjvAdapter implements SchemaValidator {
  async validate (request: MiddlewareRequest, schema: Object): Promise<Either<Error, SchemaValidatorResult>> {
    try {
      const ajv = new Ajv()
      const validate = ajv.compile(schema)
      const isValid = validate(request.payload)

      if (isValid) {
        return right({ isValid: true })
      } else {
        return right({ isValid: false, errors: validate.errors })
      }
    } catch (error) {
      return left(error)
    }
  }
}
