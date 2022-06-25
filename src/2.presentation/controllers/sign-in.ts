import AuthenticateUserUseCase from '@/1.application/use-cases/authenticate-user'
import Controller from '@/2.presentation/base/controller'
import { HttpRequest } from '@/2.presentation/types/http-request'
import { HttpResponse } from '@/2.presentation/types/http-response'
import { SignInData } from '@/2.presentation/types/sign-in-data'
import { clientError, serverError, success } from '@/2.presentation/utils/http-response'

export default class SignInController extends Controller {
  constructor (private readonly props: {
    authenticateUserUseCase: AuthenticateUserUseCase
  }) { super() }

  async handle (httpRequest: HttpRequest<SignInData>): Promise<HttpResponse> {
    try {
      const { body: signInData } = httpRequest

      const accessTokenOrError = await this.props.authenticateUserUseCase.execute(signInData)

      if (accessTokenOrError.isLeft()) {
        return clientError.unauthorized(accessTokenOrError.value)
      }

      const accessToken = accessTokenOrError.value

      return success.ok({ accessToken })
    } catch (error) {
      return serverError.internalServerError(error)
    }
  }
}
