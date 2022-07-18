import CreateUserUseCase, { CreateUserResultDTO } from '@/1.application/use-cases/create-user-use-case'
import Controller, { AppRequest, AppResponse } from '@/2.presentation/base/controller'
import { clientError } from '@/2.presentation/factories/client-error-factory'
import { serverError } from '@/2.presentation/factories/server-error-factory'
import { success } from '@/2.presentation/factories/success-factory'

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

  async handle (request: AppRequest<SignUpData>): Promise<AppResponse<CreateUserResultDTO>> {
    try {
      const { payload: signUpData } = request
      const createUserResultDtoOrError = await this.props.createUserUseCase.execute(signUpData)

      if (createUserResultDtoOrError.isLeft()) {
        return clientError.badRequest(createUserResultDtoOrError.value)
      }

      const createUserResultDTO = createUserResultDtoOrError.value

      return success.ok(createUserResultDTO)
    } catch (error) {
      return serverError.internalServerError(error)
    }
  }
}
