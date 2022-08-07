import { Encrypter } from '@/core/1.application/cryptography/encrypter'
import { AppResponse } from '@/core/2.presentation/base/controller'
import { Middleware, MiddlewareRequest } from '@/core/2.presentation/middleware/middleware'
import { InvalidTokenError } from '@/core/3.infra/errors/invalid-token-error'
import { MissingTokenError } from '@/core/3.infra/errors/missing-token-error'

type ConstructProps = {
  encrypter: Encrypter
  role?: string
}

export class AuthMiddleware implements Middleware {
  constructor (private readonly props: ConstructProps) {}

  async handle (request: MiddlewareRequest): Promise<AppResponse<any>> {
    const { encrypter } = this.props

    if (!request.accessToken) {
      return {
        payload: [new MissingTokenError()],
        statusCode: 401
      }
    }

    const [type, accessToken] = request.accessToken?.split(' ')

    if (type !== 'Bearer' || !accessToken) {
      return {
        payload: [new InvalidTokenError('Bearer')],
        statusCode: 401
      }
    }

    const decryptedTokenOrError = await encrypter.decrypt(accessToken)

    if (decryptedTokenOrError.isLeft()) {
      return {
        payload: [new InvalidTokenError('Bearer')],
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
