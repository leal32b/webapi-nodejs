import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type Encrypter, type TokenData } from '@/common/1.application/cryptography/encrypter'
import { type MiddlewareRequest, type Middleware } from '@/common/1.application/middleware/middleware'
import { type AppResponse } from '@/common/2.presentation/base/controller'
import { InvalidTokenError } from '@/common/2.presentation/errors/invalid-token-error'
import { MissingAuthError } from '@/common/2.presentation/errors/missing-auth-error'
import { MissingTokenError } from '@/common/2.presentation/errors/missing-token-error'
import { clientError } from '@/common/2.presentation/factories/client-error-factory'
import { success } from '@/common/2.presentation/factories/success-factory'

type Props = {
  encrypter: Encrypter
}

export class AuthMiddleware implements Middleware {
  private constructor (private readonly props: Props) {}

  public static create (props: Props): AuthMiddleware {
    return new AuthMiddleware(props)
  }

  public async handle (request: MiddlewareRequest): Promise<AppResponse<any>> {
    const { auth, accessToken } = request
    const appResponse = success.ok(request.payload)

    if (!auth?.length) {
      return appResponse
    }

    const decryptedTokenOrError = await this.decryptToken(accessToken)

    if (decryptedTokenOrError.isLeft()) {
      return decryptedTokenOrError.value
    }

    const decryptedToken = decryptedTokenOrError.value
    const userAuth = decryptedToken.payload.auth
    const authorizedOrError = this.verifyAuth(auth, userAuth)

    if (authorizedOrError.isLeft()) {
      return authorizedOrError.value
    }

    return appResponse
  }

  private async decryptToken (accessToken: string): Promise<Either<AppResponse<any>, TokenData>> {
    const { encrypter } = this.props

    if (!accessToken) {
      return left(clientError.unauthorized([MissingTokenError.create()]))
    }

    const [type, token] = accessToken?.split(' ')

    if (type !== 'Bearer' || !token) {
      return left(clientError.unauthorized([InvalidTokenError.create('Bearer')]))
    }

    const decryptedTokenOrError = await encrypter.decrypt(token)

    if (decryptedTokenOrError.isLeft()) {
      return left(clientError.unauthorized([InvalidTokenError.create('Bearer')]))
    }

    return right(decryptedTokenOrError.value)
  }

  private verifyAuth (auth: string[], userAuth: string[]): Either<AppResponse<any>, void> {
    if (!userAuth.some(a => auth.includes(a))) {
      return left(clientError.unauthorized([MissingAuthError.create(auth)]))
    }

    return right()
  }
}
