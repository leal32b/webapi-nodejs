import { type DomainError } from '@/common/0.domain/base/domain-error'
import { Handler } from '@/common/0.domain/base/handler'
import { type Either } from '@/common/0.domain/utils/either'

import { type UserCreatedEvent } from '@/identity/0.domain/events/user-created.event'
import { type SetGroupsUseCase, type SetGroupsResultDTO } from '@/identity/1.application/use-cases/set-groups.use-case'

type Props = {
  setGroupsUseCase: SetGroupsUseCase
}

export class UserSetGroupsHandler extends Handler<Props> {
  public static create (props: Props): UserSetGroupsHandler {
    return new UserSetGroupsHandler(props)
  }

  public async handle (event: UserCreatedEvent): Promise<Either<DomainError[], SetGroupsResultDTO>> {
    const { setGroupsUseCase } = this.props
    const { email } = event.payload

    const result = await setGroupsUseCase.execute({
      email,
      groups: ['user']
    })

    return result
  }
}
