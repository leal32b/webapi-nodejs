import { Controller, type AppRequest, type AppResponse } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server.error'
import { clientError } from '@/common/2.presentation/factories/client-error.factory'
import { serverError } from '@/common/2.presentation/factories/server-error.factory'
import { success } from '@/common/2.presentation/factories/success.factory'

import { type SignUpUseCase, type SignUpResultDTO, type SignUpData } from '@/identity/1.application/use-cases/sign-up.use-case'

type Props = {
  signUpUseCase: SignUpUseCase
}

export class SignUpController extends Controller<Props> {
  public static create (props: Props): SignUpController {
    return new SignUpController(props)
  }

  public async handle (request: AppRequest<SignUpData>): Promise<AppResponse<SignUpResultDTO>> {
    const { payload: signUpData } = request

    const signUpResultDtoOrError = await this.props.signUpUseCase.execute(signUpData)

    if (signUpResultDtoOrError.isLeft()) {
      const error = signUpResultDtoOrError.value

      return error[0] instanceof ServerError
        ? serverError.internalServerError(error)
        : clientError.badRequest(error)
    }

    const signUpResultDTO = signUpResultDtoOrError.value

    return success.ok(signUpResultDTO)
  }
}
