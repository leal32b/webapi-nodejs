import { Controller, type AppRequest, type AppResponse } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server-error'
import { clientError } from '@/common/2.presentation/factories/client-error-factory'
import { serverError } from '@/common/2.presentation/factories/server-error-factory'
import { success } from '@/common/2.presentation/factories/success-factory'

import { type SignInUserData, type SignInUserResultDTO, type SignInUserUseCase } from '@/identity/1.application/use-cases/sign-in-user-use-case'

type Props = {
  signInUserUseCase: SignInUserUseCase
}

export class SignInController extends Controller<Props> {
  public static create (props: Props): SignInController {
    return new SignInController(props)
  }

  public async handle (request: AppRequest<SignInUserData>): Promise<AppResponse<SignInUserResultDTO>> {
    const { payload: signInData } = request
    const signInUserResultDtoOrError = await this.props.signInUserUseCase.execute(signInData)

    if (signInUserResultDtoOrError.isLeft()) {
      const error = signInUserResultDtoOrError.value

      return error[0] instanceof ServerError
        ? serverError.internalServerError(error)
        : clientError.unauthorized(error)
    }

    const signInUserResultDto = signInUserResultDtoOrError.value

    return success.ok(signInUserResultDto)
  }
}
