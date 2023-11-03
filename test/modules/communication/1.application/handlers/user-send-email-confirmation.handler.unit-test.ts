import { UserSendEmailConfirmationHandler } from '@/communication/1.application/handlers/user-send-email-confirmation.handler'
import { type SendEmailConfirmationUseCase } from '@/communication/1.application/use-cases/send-email-confirmation.use-case'
import { UserCreatedEvent } from '@/identity/0.domain/events/user-created.event'

const makeSendEmailConfirmationUseCaseStub = (): SendEmailConfirmationUseCase => ({
  execute: vi.fn()
} as any)

type SutTypes = {
  userCreatedEventFake: UserCreatedEvent
  sendEmailConfirmationUseCase: SendEmailConfirmationUseCase
  sut: UserSendEmailConfirmationHandler
}

const makeSut = (): SutTypes => {
  const doubles = {
    userCreatedEventFake: UserCreatedEvent.create({
      aggregateId: 'any_id',
      createdAt: new Date(),
      payload: {
        email: 'any@mail.com',
        id: 'any_id',
        locale: 'any_locale',
        token: 'any_token'
      }
    })
  }
  const props = {
    sendEmailConfirmationUseCase: makeSendEmailConfirmationUseCaseStub()
  }
  const sut = UserSendEmailConfirmationHandler.create(props)

  return {
    ...doubles,
    ...props,
    sut
  }
}

describe('UserSendEmailConfirmationHandler', () => {
  describe('success', () => {
    it('executes SendEmailConfirmationUseCase', async () => {
      const { sut, sendEmailConfirmationUseCase, userCreatedEventFake } = makeSut()
      const executeSpy = vi.spyOn(sendEmailConfirmationUseCase, 'execute')

      await sut.handle(userCreatedEventFake)

      expect(executeSpy).toHaveBeenCalledWith({
        locale: 'any_locale',
        recipientEmail: 'any@mail.com',
        token: 'any_token'
      })
    })
  })
})
