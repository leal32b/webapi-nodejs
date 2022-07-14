import CreateUserUseCase from '@/1.application/use-cases/create-user-use-case'
import Controller from '@/2.presentation/base/controller'
import { HttpRequest } from '@/2.presentation/types/http-request'
import { HttpResponse } from '@/2.presentation/types/http-response'
import { clientError, serverError, success } from '@/2.presentation/utils/http-response'

export type SignUpData = {
  email: string
  name: string
  password: string
  passwordRetype: string
}

export default class SignUpController extends Controller {
  constructor (private readonly props: {
    createUserUseCase: CreateUserUseCase
  }) { super() }

  async handle (httpRequest: HttpRequest<SignUpData>): Promise<HttpResponse> {
    try {
      const { body: signUpData } = httpRequest

      const createUserResultDtoOrError = await this.props.createUserUseCase.execute(signUpData)

      if (createUserResultDtoOrError.isLeft()) {
        return clientError.badRequest(createUserResultDtoOrError.value)
      }

      const createUserResultDTO = createUserResultDtoOrError.value

      return success.ok(createUserResultDTO)
    } catch (error) {
      return serverError.internalServerError()
    }
  }
}
