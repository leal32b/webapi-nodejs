import { Controller, AppRequest, AppResponse } from '@/core/2.presentation/base/controller'
import { clientError } from '@/core/2.presentation/factories/client-error-factory'
import { serverError } from '@/core/2.presentation/factories/server-error-factory'
import { success } from '@/core/2.presentation/factories/success-factory'
import { AuthenticateUserResultDTO, AuthenticateUserUseCase } from '@/modules/user/1.application/use-cases/authenticate-user-use-case'

export type SignInData = {
  email: string
  password: string
}

export class SignInController extends Controller {
  constructor (private readonly props: {
    authenticateUserUseCase: AuthenticateUserUseCase
  }) { super() }

  async handle (request: AppRequest<SignInData>): Promise<AppResponse<AuthenticateUserResultDTO>> {
    try {
      const { payload: signInData } = request

      const authenticateUserResultDtoOrError = await this.props.authenticateUserUseCase.execute(signInData)

      if (authenticateUserResultDtoOrError.isLeft()) {
        return clientError.unauthorized(authenticateUserResultDtoOrError.value)
      }

      const authenticateUserResultDto = authenticateUserResultDtoOrError.value

      return success.ok(authenticateUserResultDto)
    } catch (error) {
      return serverError.internalServerError(error)
    }
  }
}
