import { persistence } from '@/common/4.main/container'

import { CreateGroupUseCase } from '@/identity/1.application/use-cases/create-group.use-case'
import { CreateGroupController } from '@/identity/2.presentation/controllers/create-group.controller'

export const createGroupControllerFactory = (): CreateGroupController => {
  const { groupRepository } = persistence.actual.repositories
  const createGroupUseCase = CreateGroupUseCase.create({
    groupRepository
  })

  return CreateGroupController.create({ createGroupUseCase })
}
