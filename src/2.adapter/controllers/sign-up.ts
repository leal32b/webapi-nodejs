import CreateUserUsecase from '@/1.application/usecases/create-user'
import { clientError, serverError, success } from '@/2.adapter/helpers/http-response'
import Controller from '@/2.adapter/interfaces/controller'
import Validator from '@/2.adapter/interfaces/validator'
import { HttpRequest, HttpResponse } from '@/2.adapter/types/http'

export default class SignUpController implements Controller {
  constructor (private readonly props: {
    validator: Validator
    createUserUsecase: CreateUserUsecase
  }) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.props.validator.validate(httpRequest.body)

      if (error) {
        return clientError.badRequest(error)
      }

      const { name, email, password } = httpRequest.body
      const user = await this.props.createUserUsecase.execute({
        name,
        email,
        password
      })

      return success.ok({ ...user.props })
    } catch (error) {
      return serverError.internalServerError(error)
    }
  }
}
