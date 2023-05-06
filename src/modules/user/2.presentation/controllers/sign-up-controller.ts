import { Controller, type AppRequest, type AppResponse } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server-error'
import { clientError } from '@/common/2.presentation/factories/client-error-factory'
import { serverError } from '@/common/2.presentation/factories/server-error-factory'
import { success } from '@/common/2.presentation/factories/success-factory'

import { type CreateUserUseCase, type CreateUserResultDTO, type CreateUserData } from '@/user/1.application/use-cases/create-user-use-case'

type Props = {
  createUserUseCase: CreateUserUseCase
}

export class SignUpController extends Controller<Props> {
  public static create (props: Props): SignUpController {
    return new SignUpController(props)
  }

  public async handle (request: AppRequest<CreateUserData>): Promise<AppResponse<CreateUserResultDTO>> {
    const { payload: signUpData } = request

    const createUserResultDtoOrError = await this.props.createUserUseCase.execute(signUpData)

    if (createUserResultDtoOrError.isLeft()) {
      const error = createUserResultDtoOrError.value

      return error[0] instanceof ServerError
        ? serverError.internalServerError(error)
        : clientError.badRequest(error)
    }

    const createUserResultDTO = createUserResultDtoOrError.value

    return success.ok(createUserResultDTO)
  }
}
