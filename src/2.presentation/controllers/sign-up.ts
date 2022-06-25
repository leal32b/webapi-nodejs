import CreateUserUseCase from '@/1.application/use-cases/create-user'
import Controller from '@/2.presentation/base/controller'
import { HttpRequest } from '@/2.presentation/types/http-request'
import { HttpResponse } from '@/2.presentation/types/http-response'
import { SignUpData } from '@/2.presentation/types/sign-up-data'
import { clientError, serverError, success } from '@/2.presentation/utils/http-response'

export default class SignUpController extends Controller {
  constructor (private readonly props: {
    createUserUseCase: CreateUserUseCase
  }) { super() }

  async handle (httpRequest: HttpRequest<SignUpData>): Promise<HttpResponse> {
    try {
      const { body: signUpData } = httpRequest

      const userOrError = await this.props.createUserUseCase.execute(signUpData)

      if (userOrError.isLeft()) {
        return clientError.badRequest(userOrError.value)
      }

      const user = userOrError.value

      return success.ok({ ...user.getValue() })
    } catch (error) {
      return serverError.internalServerError(error)
    }
  }
}
