import { Controller, type AppRequest, type AppResponse } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server-error'
import { clientError } from '@/common/2.presentation/factories/client-error-factory'
import { serverError } from '@/common/2.presentation/factories/server-error-factory'
import { success } from '@/common/2.presentation/factories/success-factory'

import { type SignUpUserUseCase, type SignUpUserResultDTO, type SignUpUserData } from '@/identity/1.application/use-cases/sign-up-user-use-case'

type Props = {
  signUpUserUseCase: SignUpUserUseCase
}

export class SignUpController extends Controller<Props> {
  public static create (props: Props): SignUpController {
    return new SignUpController(props)
  }

  public async handle (request: AppRequest<SignUpUserData>): Promise<AppResponse<SignUpUserResultDTO>> {
    const { payload: signUpData } = request

    const signUpUserResultDtoOrError = await this.props.signUpUserUseCase.execute(signUpData)

    if (signUpUserResultDtoOrError.isLeft()) {
      const error = signUpUserResultDtoOrError.value

      return error[0] instanceof ServerError
        ? serverError.internalServerError(error)
        : clientError.badRequest(error)
    }

    const signUpUserResultDTO = signUpUserResultDtoOrError.value

    return success.ok(signUpUserResultDTO)
  }
}
