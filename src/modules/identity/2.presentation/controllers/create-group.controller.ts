import { type AppRequest, type AppResponse, Controller } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server.error'
import { clientError } from '@/common/2.presentation/factories/client-error.factory'
import { serverError } from '@/common/2.presentation/factories/server-error.factory'
import { success } from '@/common/2.presentation/factories/success.factory'

import { type CreateGroupData, type CreateGroupResultDTO, type CreateGroupUseCase } from '@/identity/1.application/use-cases/create-group.use-case'

type Props = {
  createGroupUseCase: CreateGroupUseCase
}

export class CreateGroupController extends Controller<Props> {
  public static create (props: Props): CreateGroupController {
    return new CreateGroupController(props)
  }

  public async handle (request: AppRequest<CreateGroupData>): Promise<AppResponse<CreateGroupResultDTO>> {
    const { payload: createGroupData } = request

    const createGroupResultDtoOrError = await this.props.createGroupUseCase.execute(createGroupData)

    if (createGroupResultDtoOrError.isLeft()) {
      const error = createGroupResultDtoOrError.value

      return error[0] instanceof ServerError
        ? serverError.internalServerError(error)
        : clientError.badRequest(error)
    }

    const createGroupResultDTO = createGroupResultDtoOrError.value

    return success.ok(createGroupResultDTO)
  }
}
