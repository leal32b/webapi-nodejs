import AuthenticateUserUseCase, { AuthenticateUserResultDTO } from '@/1.application/use-cases/authenticate-user-use-case'
import Controller, { AppRequest, AppResponse } from '@/2.presentation/base/controller'
import { clientError } from '@/2.presentation/factories/client-error-factory'
import { serverError } from '@/2.presentation/factories/server-error-factory'
import { success } from '@/2.presentation/factories/success-factory'

export type SignInData = {
  email: string
  password: string
}

export default class SignInController extends Controller {
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
