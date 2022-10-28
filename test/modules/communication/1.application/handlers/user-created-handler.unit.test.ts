import { UserCreatedHandler } from '@/communication/1.application/handlers/user-created-handler'
import { SendEmailValidationEmailUseCase } from '@/communication/1.application/use-cases/send-email-validation-email-use-case'
import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { DomainEvents } from '@/core/0.domain/events/domain-events'
import { UserCreatedEvent } from '@/user/0.domain/events/user-created-event'

type ConstructParamsFake = {
  anyKey: string
}

class AggregateFake extends AggregateRoot<ConstructParamsFake> {
  static create (): AggregateFake {
    const aggregateFake = new AggregateFake({ anyKey: 'any_value' })
    aggregateFake.addEvent(new UserCreatedEvent({
      aggregateId: aggregateFake.id,
      payload: {
        email: 'any@mail.com',
        token: 'any_token'
      }
    }))

    return aggregateFake
  }
}

const makeSendEmailValidationEmailUseCaseStub = (): SendEmailValidationEmailUseCase => ({
  execute: vi.fn()
} as any)

type SutTypes = {
  sut: UserCreatedHandler
  sendEmailValidationEmailUseCase: SendEmailValidationEmailUseCase
  aggregateFake: AggregateRoot<ConstructParamsFake>
}

const makeSut = (): SutTypes => {
  const doubles = {
    aggregateFake: AggregateFake.create()
  }
  const params = {
    sendEmailValidationEmailUseCase: makeSendEmailValidationEmailUseCaseStub()
  }
  const sut = new UserCreatedHandler(params)

  return { sut, ...params, ...doubles }
}

describe('UserCreatedHandler', () => {
  describe('success', () => {
    it('executes SendEmailValidationEmailUseCase on dispatchEventsForAggregate', () => {
      const { aggregateFake, sendEmailValidationEmailUseCase } = makeSut()
      const executeSpy = vi.spyOn(sendEmailValidationEmailUseCase, 'execute')

      DomainEvents.dispatchEventsForAggregate(aggregateFake.id)

      expect(executeSpy).toHaveBeenCalledWith({
        recipientEmail: 'any@mail.com',
        token: 'any_token'
      })
    })
  })
})
