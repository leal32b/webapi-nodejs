import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { DomainEvents } from '@/core/0.domain/events/domain-events'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { UserCreatedEvent } from '@/user/0.domain/events/user-created-event'

const makeAggregateFake = (): UserAggregate => UserAggregate.create({
  email: 'any@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'hashed_password',
  token: 'any_token'
}).value as UserAggregate

type PayloadFake = {
  anyKey: string
}

const handlerFunction = jest.fn()

const makeHandlerFake = (): (event: DomainEvent<PayloadFake>) => void => handlerFunction

type SutTypes = {
  sut: typeof DomainEvents
  aggregateFake: UserAggregate
  handlerFunction: Function
  handlerFake: (event: DomainEvent<PayloadFake>) => void
}

const makeSut = (): SutTypes => {
  const doubles = {
    aggregateFake: makeAggregateFake(),
    handlerFunction,
    handlerFake: makeHandlerFake()
  }
  const sut = DomainEvents

  return { sut, ...doubles }
}

describe('DomainEvents', () => {
  describe('success', () => {
    it('register callbacks for an eventClassName', () => {
      const { sut, aggregateFake, handlerFake } = makeSut()
      sut.markAggregateForDispatch(aggregateFake)

      sut.register(handlerFake, UserCreatedEvent.name)
      const result = sut.handlers

      expect(result).toEqual({ UserCreatedEvent: expect.any(Array) })
    })

    it('marks an aggregate to dispatch', () => {
      const { sut, aggregateFake } = makeSut()

      sut.markAggregateForDispatch(aggregateFake)
      const result = sut.markedAggregates

      expect(result.every(item => item instanceof AggregateRoot)).toBe(true)
    })

    it('returns when there is no aggregate to dispatch events on dispatchEventsForAggregate', () => {
      const { sut, aggregateFake } = makeSut()
      const clearEventsSpy = jest.spyOn(aggregateFake, 'clearEvents')
      sut.clearMarkedAggregates()

      sut.dispatchEventsForAggregate(aggregateFake.id)

      expect(clearEventsSpy).not.toBeCalled()
    })

    it('returns when there is no handler to execute on dispatchEventsForAggregate', () => {
      const { sut, aggregateFake, handlerFunction } = makeSut()
      sut.clearHandlers()

      sut.dispatchEventsForAggregate(aggregateFake.id)

      expect(handlerFunction).not.toBeCalled()
    })

    it('dispatches events for aggregate', () => {
      const { sut, aggregateFake, handlerFunction, handlerFake } = makeSut()
      sut.markAggregateForDispatch(aggregateFake)
      sut.register(handlerFake, UserCreatedEvent.name)

      sut.dispatchEventsForAggregate(aggregateFake.id)

      expect(handlerFunction).toBeCalled()
    })

    it('removes aggregate from markedAggregates on dispatchEventsForAggregate', () => {
      const { sut, aggregateFake } = makeSut()
      sut.markAggregateForDispatch(aggregateFake)

      sut.dispatchEventsForAggregate(aggregateFake.id)
      const result = sut.markedAggregates

      expect(result).toEqual([])
    })

    it('calls aggregate.clearEvents on dispatchEventsForAggregate', () => {
      const { sut, aggregateFake } = makeSut()
      sut.markAggregateForDispatch(aggregateFake)

      sut.dispatchEventsForAggregate(aggregateFake.id)
      const result = aggregateFake.events

      expect(result).toEqual([])
    })

    it('clears markedAggregates', () => {
      const { sut, aggregateFake } = makeSut()
      sut.markAggregateForDispatch(aggregateFake)

      sut.clearMarkedAggregates()
      const result = sut.markedAggregates

      expect(result).toEqual([])
    })

    it('clears handlers', () => {
      const { sut, aggregateFake, handlerFake } = makeSut()
      sut.markAggregateForDispatch(aggregateFake)
      sut.register(handlerFake, UserCreatedEvent.name)

      sut.clearHandlers()
      const result = sut.handlers

      expect(result).toEqual({})
    })
  })
})
