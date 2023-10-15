import { type HandlerFn } from '@/common/1.application/events/message-broker'
import { persistence } from '@/common/4.main/container'

import { UserSetGroupsHandler } from '@/identity/1.application/handlers/user-set-group.handler'
import { SetGroupsUseCase } from '@/identity/1.application/use-cases/set-groups.use-case'

export const userSetGroupHandlerFactory = (): HandlerFn => {
  const { groupRepository, userRepository } = persistence.actual.repositories
  const setGroupsUseCase = SetGroupsUseCase.create({
    groupRepository,
    userRepository
  })

  const userSetGroupHandler = UserSetGroupsHandler.create({ setGroupsUseCase })

  return userSetGroupHandler.handle.bind(userSetGroupHandler)
}
