import { type DomainError } from '@/common/0.domain/base/domain-error'
import { right, type Either, left } from '@/common/0.domain/utils/either'
import { UseCase } from '@/common/1.application/base/use-case'

import { type GroupRepository } from '@/identity/1.application/repositories/group.repository'
import { type UserRepository } from '@/identity/1.application/repositories/user.repository'

type Props = {
  groupRepository: GroupRepository
  userRepository: UserRepository
}

export type SetGroupsData = {
  groups: string[]
  id: string
}

export type SetGroupsResultDTO = {
  message: string
}

export class SetGroupsUseCase extends UseCase<Props, SetGroupsData, SetGroupsResultDTO> {
  public static create (props: Props): SetGroupsUseCase {
    return new SetGroupsUseCase(props)
  }

  async execute (setGroupsData: SetGroupsData): Promise<Either<DomainError[], SetGroupsResultDTO>> {
    const { groupRepository, userRepository } = this.props
    const { id, groups: groupNames } = setGroupsData

    const userAggregateOrError = await userRepository.readById(id)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value
    const groupEntitiesOrError = await groupRepository.readManyByNames(groupNames)

    if (groupEntitiesOrError.isLeft()) {
      return left(groupEntitiesOrError.value)
    }

    const groupEntities = groupEntitiesOrError.value
    userAggregate.setGroups(groupEntities)

    const updatedOrError = await userRepository.update(userAggregate)

    if (updatedOrError.isLeft()) {
      return left(updatedOrError.value)
    }

    return right({ message: 'groups set successfully' })
  }
}
