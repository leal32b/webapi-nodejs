import { UserCreatedEvent } from '@/identity/0.domain/events/user-created.event'
import { UserSetGroupsHandler } from '@/identity/1.application/handlers/user-set-group.handler'
import { type SetGroupsUseCase } from '@/identity/1.application/use-cases/set-groups.use-case'

const makeSetGroupsUseCaseStub = (): SetGroupsUseCase => ({
  execute: vi.fn()
} as any)

type SutTypes = {
  userCreatedEventFake: UserCreatedEvent
  setGroupsUseCase: SetGroupsUseCase
  sut: UserSetGroupsHandler
}

const makeSut = (): SutTypes => {
  const doubles = {
    userCreatedEventFake: UserCreatedEvent.create({
      aggregateId: 'any_id',
      createdAt: new Date(),
      payload: {
        email: 'any@mail.com',
        locale: 'any_locale',
        token: 'any_token'
      }
    })
  }
  const props = {
    setGroupsUseCase: makeSetGroupsUseCaseStub()
  }
  const sut = UserSetGroupsHandler.create(props)

  return {
    ...doubles,
    ...props,
    sut
  }
}

describe('UserSetGroupsHandler', () => {
  describe('success', () => {
    it('executes SetGroupUseCase', async () => {
      const { sut, setGroupsUseCase, userCreatedEventFake } = makeSut()
      const executeSpy = vi.spyOn(setGroupsUseCase, 'execute')

      await sut.handle(userCreatedEventFake)

      expect(executeSpy).toHaveBeenCalledWith({
        email: 'any@mail.com',
        groups: [
          'user'
        ]
      })
    })
  })
})
