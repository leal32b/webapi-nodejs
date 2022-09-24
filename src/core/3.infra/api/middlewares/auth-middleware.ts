import { Encrypter } from '@/core/1.application/cryptography/encrypter'
import { AppResponse } from '@/core/2.presentation/base/controller'
import { clientError } from '@/core/2.presentation/factories/client-error-factory'
import { success } from '@/core/2.presentation/factories/success-factory'
import { Middleware, MiddlewareRequest } from '@/core/2.presentation/middleware/middleware'
import { InvalidTokenError } from '@/core/3.infra/errors/invalid-token-error'
import { MissingAuthError } from '@/core/3.infra/errors/missing-auth-error'
import { MissingTokenError } from '@/core/3.infra/errors/missing-token-error'

type ConstructProps = {
  encrypter: Encrypter
}

export class AuthMiddleware implements Middleware {
  constructor (private readonly props: ConstructProps) {}

  async handle (request: MiddlewareRequest): Promise<AppResponse<any>> {
    const { encrypter } = this.props
    const { auth, accessToken } = request
    const appResponse = success.ok(request.payload)

    if (!auth || !auth.length) {
      return appResponse
    }

    if (!accessToken) {
      return clientError.unauthorized([new MissingTokenError()])
    }

    const [type, token] = accessToken?.split(' ')

    if (type !== 'Bearer' || !token) {
      return clientError.unauthorized([new InvalidTokenError('Bearer')])
    }

    const decryptedTokenOrError = await encrypter.decrypt(token)

    if (decryptedTokenOrError.isLeft()) {
      return clientError.unauthorized([new InvalidTokenError('Bearer')])
    }

    const decryptedToken = decryptedTokenOrError.value
    const userAuth = decryptedToken.payload.auth

    if (!userAuth.some(a => request.auth.includes(a))) {
      return clientError.unauthorized([new MissingAuthError(request.auth)])
    }

    return appResponse
  }
}
