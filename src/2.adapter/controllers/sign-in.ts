import AuthenticateUserUsecase from '@/1.application/usecases/authenticate-user'
import InvalidParamError from '@/2.adapter/errors/invalid-param-error'
import MissingParamError from '@/2.adapter/errors/missing-param-error'
import { clientError, serverError, success } from '@/2.adapter/helpers/http-response'
import Controller from '@/2.adapter/interfaces/controller'
import ExtEmailValidator from '@/2.adapter/interfaces/ext-email-validator'
import { HttpRequest, HttpResponse } from '@/2.adapter/types/http'

export default class SignInController implements Controller {
  constructor (private readonly props: {
    emailValidator: ExtEmailValidator
    authenticateUserUsecase: AuthenticateUserUsecase
  }) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return clientError.badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body
      const isValid = this.props.emailValidator.isValid(email)

      if (!isValid) {
        return clientError.badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.props.authenticateUserUsecase.execute({ email, password })

      if (!accessToken) {
        return clientError.unauthorized()
      }

      return success.ok({ accessToken })
    } catch (error) {
      return serverError.internalServerError(error)
    }
  }
}
