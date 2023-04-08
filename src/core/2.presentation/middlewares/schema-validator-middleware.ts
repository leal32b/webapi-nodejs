import { type Middleware, type MiddlewareRequest } from '@/core/1.application/middleware/middleware'
import { type AppResponse } from '@/core/2.presentation/base/controller'
import { clientError } from '@/core/2.presentation/factories/client-error-factory'
import { serverError } from '@/core/2.presentation/factories/server-error-factory'
import { success } from '@/core/2.presentation/factories/success-factory'
import { type SchemaValidator } from '@/core/2.presentation/validators/schema-validator'

type Props = {
  schemaValidator: SchemaValidator
}

export class SchemaValidatorMiddleware implements Middleware {
  private constructor (private readonly props: Props) {}

  public static create (props: Props): SchemaValidatorMiddleware {
    return new SchemaValidatorMiddleware(props)
  }

  public async handle (request: MiddlewareRequest): Promise<AppResponse<any>> {
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
