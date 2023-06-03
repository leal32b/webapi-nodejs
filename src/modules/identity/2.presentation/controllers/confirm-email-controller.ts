import { type AppRequest, type AppResponse, Controller } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server-error'
import { clientError } from '@/common/2.presentation/factories/client-error-factory'
import { serverError } from '@/common/2.presentation/factories/server-error-factory'
import { success } from '@/common/2.presentation/factories/success-factory'

import { type ConfirmEmailUseCase } from '@/identity/1.application/use-cases/confirm-email-use-case'

type Props = {
  confirmEmailUseCase: ConfirmEmailUseCase
}

export class ConfirmEmailController extends Controller<Props> {
  public static create (props: Props): ConfirmEmailController {
    return new ConfirmEmailController(props)
  }

  async handle (request: AppRequest<any>): Promise<AppResponse<any>> {
    const { payload: confirmEmailData } = request

    const confirmEmailResultDtoOrError = await this.props.confirmEmailUseCase.execute(confirmEmailData)

    if (confirmEmailResultDtoOrError.isLeft()) {
      const error = confirmEmailResultDtoOrError.value

      return error[0] instanceof ServerError
        ? serverError.internalServerError(error)
        : clientError.badRequest(error)
    }

    const signUpUserResultDTO = confirmEmailResultDtoOrError.value

    return success.ok(signUpUserResultDTO)
  }
}
