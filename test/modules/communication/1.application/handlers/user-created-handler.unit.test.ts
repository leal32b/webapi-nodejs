import { UserCreatedHandler } from '@/communication/1.application/handlers/user-created-handler'
import { type SendEmailConfirmationEmailUseCase } from '@/communication/1.application/use-cases/send-email-confirmation-email-use-case'
import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { DomainEvents } from '@/core/0.domain/events/domain-events'
import { UserCreatedEvent } from '@/user/0.domain/events/user-created-event'

type ConstructParamsFake = {
  anyKey: string
}

class AggregateFake extends AggregateRoot<ConstructParamsFake> {
  static create (): AggregateFake {
    const aggregateFake = new AggregateFake({ anyKey: 'any_value' })
    aggregateFake.addEvent(UserCreatedEvent.create({
      aggregateId: aggregateFake.id,
      payload: {
        email: 'any@mail.com',
        locale: 'en',
        token: 'any_token'
      }
    }))

    return aggregateFake
  }
}

const makeSendEmailConfirmationEmailUseCaseStub = (): SendEmailConfirmationEmailUseCase => ({
  execute: vi.fn()
} as any)

type SutTypes = {
  sut: UserCreatedHandler
  sendEmailConfirmationEmailUseCase: SendEmailConfirmationEmailUseCase
  aggregateFake: AggregateRoot<ConstructParamsFake>
}

const makeSut = (): SutTypes => {
  const doubles = {
    aggregateFake: AggregateFake.create()
  }
  const props = {
    sendEmailConfirmationEmailUseCase: makeSendEmailConfirmationEmailUseCaseStub()
  }
  const sut = UserCreatedHandler.create(props)

  return { sut, ...props, ...doubles }
}

describe('UserCreatedHandler', () => {
  describe('success', () => {
    it('executes SendEmailConfirmationEmailUseCase on dispatchEventsForAggregate', () => {
      const { aggregateFake, sendEmailConfirmationEmailUseCase } = makeSut()
      const executeSpy = vi.spyOn(sendEmailConfirmationEmailUseCase, 'execute')

      DomainEvents.dispatchEventsForAggregate(aggregateFake.id)

      expect(executeSpy).toHaveBeenCalledWith({
        locale: 'en',
        recipientEmail: 'any@mail.com',
        token: 'any_token'
      })
    })
  })
})
