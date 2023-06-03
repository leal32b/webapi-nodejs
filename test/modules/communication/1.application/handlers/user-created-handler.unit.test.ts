import { UserCreatedHandler } from '@/communication/1.application/handlers/user-created-handler'
import { type SendEmailConfirmationEmailUseCase } from '@/communication/1.application/use-cases/send-email-confirmation-email-use-case'
import { UserCreatedEvent } from '@/identity/0.domain/events/user-created-event'

const makeSendEmailConfirmationEmailUseCaseStub = (): SendEmailConfirmationEmailUseCase => ({
  execute: vi.fn()
} as any)

type SutTypes = {
  userCreatedEventFake: UserCreatedEvent
  sendEmailConfirmationEmailUseCase: SendEmailConfirmationEmailUseCase
  sut: UserCreatedHandler
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
    sendEmailConfirmationEmailUseCase: makeSendEmailConfirmationEmailUseCaseStub()
  }
  const sut = UserCreatedHandler.create(props)

  return {
    ...doubles,
    ...props,
    sut
  }
}

describe('UserCreatedHandler', () => {
  describe('success', () => {
    it('executes SendEmailConfirmationEmailUseCase', async () => {
      const { sut, sendEmailConfirmationEmailUseCase, userCreatedEventFake } = makeSut()
      const executeSpy = vi.spyOn(sendEmailConfirmationEmailUseCase, 'execute')

      await sut.handle(userCreatedEventFake)

      expect(executeSpy).toHaveBeenCalledWith({
        locale: 'any_locale',
        recipientEmail: 'any@mail.com',
        token: 'any_token'
      })
    })
  })
})
