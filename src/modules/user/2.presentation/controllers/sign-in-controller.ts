import { Controller, type AppRequest, type AppResponse } from '@/core/2.presentation/base/controller'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { clientError } from '@/core/2.presentation/factories/client-error-factory'
import { serverError } from '@/core/2.presentation/factories/server-error-factory'
import { success } from '@/core/2.presentation/factories/success-factory'
import { type AuthenticateUserData, type AuthenticateUserResultDTO, type AuthenticateUserUseCase } from '@/user/1.application/use-cases/authenticate-user-use-case'

type Props = {
  authenticateUserUseCase: AuthenticateUserUseCase
}

export class SignInController extends Controller<Props> {
  public static create (props: Props): SignInController {
    return new SignInController(props)
  }

  public async handle (request: AppRequest<AuthenticateUserData>): Promise<AppResponse<AuthenticateUserResultDTO>> {
    const { payload: signInData } = request
    const authenticateUserResultDtoOrError = await this.props.authenticateUserUseCase.execute(signInData)

    if (authenticateUserResultDtoOrError.isLeft()) {
      const error = authenticateUserResultDtoOrError.value

      return error[0] instanceof ServerError
        ? serverError.internalServerError(error)
        : clientError.unauthorized(error)
    }

    const authenticateUserResultDto = authenticateUserResultDtoOrError.value

    return success.ok(authenticateUserResultDto)
  }
}
