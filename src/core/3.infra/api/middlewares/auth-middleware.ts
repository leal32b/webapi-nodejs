import { Encrypter } from '@/core/1.application/cryptography/encrypter'
import { AppResponse } from '@/core/2.presentation/base/controller'
import { Middleware, MiddlewareRequest } from '@/core/2.presentation/middleware/middleware'

type ConstructProps = {
  encrypter: Encrypter
  role?: string
}

export class AuthMiddleware implements Middleware {
  constructor (private readonly props: ConstructProps) {}

  async handle (request: MiddlewareRequest): Promise<AppResponse<any>> {
    const { encrypter } = this.props
    const decryptedTokenOrError = await encrypter.decrypt(request.accessToken)

    if (decryptedTokenOrError.isLeft()) {
      return {
        payload: decryptedTokenOrError.value,
        statusCode: 401
      }
    }

    const appResponse = {
      payload: request.payload,
      statusCode: 200
    }

    return appResponse
  }
}
