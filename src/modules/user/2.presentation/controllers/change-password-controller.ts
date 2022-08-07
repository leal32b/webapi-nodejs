import { Controller, AppRequest, AppResponse } from '@/core/2.presentation/base/controller'
import { clientError } from '@/core/2.presentation/factories/client-error-factory'
import { serverError } from '@/core/2.presentation/factories/server-error-factory'
import { success } from '@/core/2.presentation/factories/success-factory'
import { ChangePasswordResultDTO, ChangePasswordUseCase } from '@/modules/user/1.application/use-cases/change-password-use-case'

export type ChangePasswordData = {
  id: string
  password: string
  passwordRetype: string
}

export class ChangePasswordController extends Controller {
  constructor (private readonly props: {
    changePasswordUseCase: ChangePasswordUseCase
  }) { super() }

  async handle (request: AppRequest<ChangePasswordData>): Promise<AppResponse<ChangePasswordResultDTO>> {
    try {
      const { payload: changePasswordData } = request
      const changePasswordResultDtoOrError = await this.props.changePasswordUseCase.execute(changePasswordData)

      if (changePasswordResultDtoOrError.isLeft()) {
        return clientError.badRequest(changePasswordResultDtoOrError.value)
      }

      const changePasswordResultDto = changePasswordResultDtoOrError.value

      return success.ok(changePasswordResultDto)
    } catch (error) {
      return serverError.internalServerError(error)
    }
  }
}
