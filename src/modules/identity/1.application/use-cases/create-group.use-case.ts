import { type DomainError } from '@/common/0.domain/base/domain-error'
import { right, type Either, left } from '@/common/0.domain/utils/either'
import { UseCase } from '@/common/1.application/base/use-case'
import { NameTakenError } from '@/common/1.application/errors/name-taken.error'

import { GroupEntity } from '@/identity/0.domain/entities/group.entity'
import { type GroupRepository } from '@/identity/1.application/repositories/group.repository'

type Props = {
  groupRepository: GroupRepository
}

export type CreateGroupData = {
  name: string
}

export type CreateGroupResultDTO = {
  name: string
  message: string
}

export class CreateGroupUseCase extends UseCase<Props, CreateGroupData, CreateGroupResultDTO> {
  public static create (props: Props): CreateGroupUseCase {
    return new CreateGroupUseCase(props)
  }

  async execute (createGroupData: CreateGroupData): Promise<Either<DomainError[], CreateGroupResultDTO>> {
    const { name } = createGroupData

    const validOrError = await this.initialValidation(createGroupData)

    if (validOrError.isLeft()) {
      return left(validOrError.value)
    }

    const groupEntityOrError = await this.createGroupEntity(createGroupData)

    return groupEntityOrError.applyOnRight(() => ({
      message: 'group created successfully',
      name
    }))
  }

  private async createGroupEntity (createGroupData: CreateGroupData): Promise<Either<DomainError[], GroupEntity>> {
    const { groupRepository } = this.props

    const groupEntityOrError = GroupEntity.create(createGroupData)

    if (groupEntityOrError.isLeft()) {
      return left(groupEntityOrError.value)
    }

    const groupEntity = groupEntityOrError.value
    const createdOrError = await groupRepository.create(groupEntity)

    return createdOrError.applyOnRight(() => groupEntity)
  }

  private async initialValidation (createGroupData: CreateGroupData): Promise<Either<DomainError[], void>> {
    const { groupRepository } = this.props
    const { name } = createGroupData

    const groupOrError = await groupRepository.readByName(name)

    if (groupOrError.isLeft()) {
      return left(groupOrError.value)
    }

    if (groupOrError.value) {
      return left([NameTakenError.create('name', name)])
    }

    return right()
  }
}
