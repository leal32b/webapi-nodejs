import { AddAccount } from '@/domain/usecases/add-account'
import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import { MissingParamError } from '@/presentation/errors/missing-param-error'
import {
  clientError,
  serverError,
  success
} from '@/presentation/helpers/http-response'
import { Controller } from '@/presentation/protocols/controller'
import { EmailValidator } from '@/presentation/protocols/email-validator'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return clientError.badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return clientError.badRequest(
          new InvalidParamError('passwordConfirmation')
        )
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return clientError.badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return success.ok(account)
    } catch (error) {
      return serverError.internalServerError()
    }
  }
}
