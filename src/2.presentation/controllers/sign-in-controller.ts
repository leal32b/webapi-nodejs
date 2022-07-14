import AuthenticateUserUseCase from '@/1.application/use-cases/authenticate-user-use-case'
import Controller from '@/2.presentation/base/controller'
import { HttpRequest } from '@/2.presentation/types/http-request'
import { HttpResponse } from '@/2.presentation/types/http-response'
import { clientError, serverError, success } from '@/2.presentation/utils/http-response'

export type SignInData = {
  email: string
  password: string
}

export default class SignInController extends Controller {
  constructor (private readonly props: {
    authenticateUserUseCase: AuthenticateUserUseCase
  }) { super() }

  async handle (httpRequest: HttpRequest<SignInData>): Promise<HttpResponse> {
    try {
      const { body: signInData } = httpRequest

      const AuthenticateUserResultDtoOrError = await this.props.authenticateUserUseCase.execute(signInData)

      if (AuthenticateUserResultDtoOrError.isLeft()) {
        return clientError.unauthorized(AuthenticateUserResultDtoOrError.value)
      }

      const authenticateUserResultDto = AuthenticateUserResultDtoOrError.value

      return success.ok(authenticateUserResultDto)
    } catch (error) {
      return serverError.internalServerError()
    }
  }
}
