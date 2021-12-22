import CreateUser from '@/0.domain/interfaces/create-user'
import InvalidParamError from '@/2.adapter/errors/invalid-param-error'
import MissingParamError from '@/2.adapter/errors/missing-param-error'
import { clientError, serverError, success } from '@/2.adapter/helpers/http-response'
import Controller from '@/2.adapter/interfaces/controller'
import EmailValidator from '@/2.adapter/interfaces/email-validator'
import { HttpRequest, HttpResponse } from '@/2.adapter/types/http'

export default class SignUpController implements Controller {
  constructor (private readonly props: {
    emailValidator: EmailValidator
    createUserUsecase: CreateUser
  }) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return clientError.badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return clientError.badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.props.emailValidator.isValid(email)

      if (!isValid) {
        return clientError.badRequest(new InvalidParamError('email'))
      }

      const user = await this.props.createUserUsecase.execute({
        name,
        email,
        password
      })

      return success.ok(user)
    } catch (error) {
      return serverError.internalServerError(error)
    }
  }
}
