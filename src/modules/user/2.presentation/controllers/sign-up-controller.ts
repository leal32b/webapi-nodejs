import { Controller, AppRequest, AppResponse } from '@/core/2.presentation/base/controller'
import { clientError } from '@/core/2.presentation/factories/client-error-factory'
import { serverError } from '@/core/2.presentation/factories/server-error-factory'
import { success } from '@/core/2.presentation/factories/success-factory'
import { CreateUserUseCase, CreateUserResultDTO } from '@/modules/user/1.application/use-cases/create-user-use-case'

export type SignUpData = {
  email: string
  name: string
  password: string
  passwordRetype: string
}

export class SignUpController extends Controller {
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
