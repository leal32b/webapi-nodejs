import { Controller, type AppRequest, type AppResponse } from '@/core/2.presentation/base/controller'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { clientError } from '@/core/2.presentation/factories/client-error-factory'
import { serverError } from '@/core/2.presentation/factories/server-error-factory'
import { success } from '@/core/2.presentation/factories/success-factory'
import { type ChangePasswordData, type ChangePasswordResultDTO, type ChangePasswordUseCase } from '@/user/1.application/use-cases/change-password-use-case'

type Props = {
  changePasswordUseCase: ChangePasswordUseCase
}

export class ChangePasswordController extends Controller<Props> {
  public static create (props: Props): ChangePasswordController {
    return new ChangePasswordController(props)
  }

  public async handle (request: AppRequest<ChangePasswordData>): Promise<AppResponse<ChangePasswordResultDTO>> {
    const { payload: changePasswordData } = request
    const changePasswordResultDtoOrError = await this.props.changePasswordUseCase.execute(changePasswordData)

    if (changePasswordResultDtoOrError.isLeft()) {
      const error = changePasswordResultDtoOrError.value

      return error[0] instanceof ServerError
        ? serverError.internalServerError(error)
        : clientError.unauthorized(error)
    }

    const changePasswordResultDto = changePasswordResultDtoOrError.value

    return success.ok(changePasswordResultDto)
  }
}
