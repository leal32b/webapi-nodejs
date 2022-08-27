import { AppResponse } from '@/core/2.presentation/base/controller'
import { clientError } from '@/core/2.presentation/factories/client-error-factory'
import { serverError } from '@/core/2.presentation/factories/server-error-factory'
import { success } from '@/core/2.presentation/factories/success-factory'
import { Middleware, MiddlewareRequest } from '@/core/2.presentation/middleware/middleware'
import { SchemaValidator } from '@/core/3.infra/api/validators/schema-validator'

type ConstructProps = {
  schemaValidator: SchemaValidator
}

export class SchemaValidatorMiddleware implements Middleware {
  constructor (private readonly props: ConstructProps) {}

  async handle (request: MiddlewareRequest): Promise<AppResponse<any>> {
    const { schemaValidator } = this.props
    const { schema } = request
    const resultOrError = await schemaValidator.validate(request, schema)

    if (resultOrError.isLeft()) {
      return serverError.internalServerError(resultOrError.value)
    }

    const result = resultOrError.value

    if (!result.isValid) {
      return clientError.unprocessableEntity(result.errors)
    }

    return success.ok(request.payload)
  }
}
