import AuthenticateUserUseCase from '@/1.application/use-cases/authenticate-user'
import { clientError, serverError, success } from '@/2.presentation/helpers/http-response'
import Controller from '@/2.presentation/interfaces/controller'
import Validator from '@/2.presentation/interfaces/validator'
import { HttpRequest, HttpResponse } from '@/2.presentation/types/http-types'

export default class SignInController implements Controller {
  constructor (private readonly props: {
    validator: Validator
    authenticateUserUseCase: AuthenticateUserUseCase
  }) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.props.validator.validate(httpRequest.body)

      if (error) {
        return clientError.badRequest(error)
      }

      const { email, password } = httpRequest.body
      const accessToken = await this.props.authenticateUserUseCase.execute({ email, password })

      if (!accessToken) {
        return clientError.unauthorized()
      }

      return success.ok({ accessToken })
    } catch (error) {
      return serverError.internalServerError(error)
    }
  }
}
