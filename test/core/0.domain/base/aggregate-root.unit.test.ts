import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { Identifier } from '@/core/0.domain/utils/identifier'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'

type ConstructParams = {
  anyKey: string
}

type PayloadFake = {
  anyKey: string
}

class AggregateFake extends AggregateRoot<ConstructParams> {
  testAddEvent (event: DomainEvent<PayloadFake>): void {
    this.addEvent(event)
  }
}

class DomainEventFake extends DomainEvent<PayloadFake> {}

const makeAggregateFake = (): UserAggregate => UserAggregate.create({
  email: 'any@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'hashed_password',
  token: 'any_token'
}).value as UserAggregate

type SutTypes = {
  sut: AggregateFake
  domainEventFake: DomainEventFake
}

const makeSut = (): SutTypes => {
  const domainEventFake = new DomainEventFake({
    aggregateId: makeAggregateFake().id,
    payload: {
      anyKey: 'any_value'
    }
  })
  const sut = new AggregateFake({ anyKey: 'any_value' })

  return { sut, domainEventFake }
}

describe('AggregateRoot', () => {
  describe('success', () => {
    it('clears the events', () => {
      const { sut, domainEventFake } = makeSut()

      sut.testAddEvent(domainEventFake)
      sut.clearEvents()
      const result = sut.events

      expect(result).toEqual([])
    })

    it('gets the id', () => {
      const { sut } = makeSut()

      const result = sut.id

      expect(result).toBeInstanceOf(Identifier)
    })

    it('gets the events', () => {
      const { sut, domainEventFake } = makeSut()

      sut.testAddEvent(domainEventFake)
      const result = sut.events

      expect(result.every(item => item instanceof DomainEvent)).toBe(true)
    })
  })
})
