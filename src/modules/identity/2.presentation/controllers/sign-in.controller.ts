import { Controller, type AppRequest, type AppResponse } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server.error'
import { clientError } from '@/common/2.presentation/factories/client-error.factory'
import { serverError } from '@/common/2.presentation/factories/server-error.factory'
import { success } from '@/common/2.presentation/factories/success.factory'

import { type SignInData, type SignInResultDTO, type SignInUseCase } from '@/identity/1.application/use-cases/sign-in.use-case'

type Props = {
  signInUseCase: SignInUseCase
}

export class SignInController extends Controller<Props> {
  public static create (props: Props): SignInController {
    return new SignInController(props)
  }

  public async handle (request: AppRequest<SignInData>): Promise<AppResponse<SignInResultDTO>> {
    const { payload: signInData } = request
    const signInResultDtoOrError = await this.props.signInUseCase.execute(signInData)

    if (signInResultDtoOrError.isLeft()) {
      const error = signInResultDtoOrError.value

      return error[0] instanceof ServerError
        ? serverError.internalServerError(error)
        : clientError.unauthorized(error)
    }

    const signInResultDto = signInResultDtoOrError.value

    return success.ok(signInResultDto)
  }
}
