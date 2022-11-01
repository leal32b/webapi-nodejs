import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { DomainEvents } from '@/core/0.domain/events/domain-events'

import { makeAggregateFake } from '~/doubles/fakes/aggregate-fake'

type SutTypes = {
  sut: typeof DomainEvents
  aggregateFake: AggregateRoot<any>
  handlerFake: (event: DomainEvent<any>) => void
}

const makeSut = (): SutTypes => {
  const doubles = {
    aggregateFake: makeAggregateFake(),
    handlerFake: vi.fn()
  }
  const sut = DomainEvents

  return { sut, ...doubles }
}

describe('DomainEvents', () => {
  describe('success', () => {
    it('register callbacks for an eventClassName', () => {
      const { sut, handlerFake } = makeSut()

      sut.register('DomainEventFake', handlerFake)

      expect(sut.handlers).toEqual({ DomainEventFake: expect.any(Array) })
    })

    it('marks an aggregate to dispatch', () => {
      const { sut, aggregateFake } = makeSut()

      sut.markAggregateForDispatch(aggregateFake)

      expect(sut.markedAggregates.every(item => item instanceof AggregateRoot)).toBe(true)
    })

    it('returns when there is no aggregate to dispatch events on dispatchEventsForAggregate', () => {
      const { sut, aggregateFake } = makeSut()
      const clearEventsSpy = vi.spyOn(aggregateFake, 'clearEvents')
      sut.clearMarkedAggregates()

      sut.dispatchEventsForAggregate(aggregateFake.id)

      expect(clearEventsSpy).not.toBeCalled()
    })

    it('returns when there is no handler to execute on dispatchEventsForAggregate', () => {
      const { sut, aggregateFake, handlerFake } = makeSut()
      sut.clearHandlers()

      sut.dispatchEventsForAggregate(aggregateFake.id)

      expect(handlerFake).not.toBeCalled()
    })

    it('dispatches events for aggregate', () => {
      const { sut, aggregateFake, handlerFake } = makeSut()
      sut.markAggregateForDispatch(aggregateFake)
      sut.register('DomainEventFake', handlerFake)

      sut.dispatchEventsForAggregate(aggregateFake.id)

      expect(handlerFake).toBeCalled()
    })

    it('removes aggregate from markedAggregates on dispatchEventsForAggregate', () => {
      const { sut, aggregateFake } = makeSut()
      sut.markAggregateForDispatch(aggregateFake)

      sut.dispatchEventsForAggregate(aggregateFake.id)

      expect(sut.markedAggregates).toEqual([])
    })

    it('calls aggregate.clearEvents on dispatchEventsForAggregate', () => {
      const { sut, aggregateFake } = makeSut()
      sut.markAggregateForDispatch(aggregateFake)

      sut.dispatchEventsForAggregate(aggregateFake.id)

      expect(aggregateFake.events).toEqual([])
    })

    it('clears markedAggregates', () => {
      const { sut, aggregateFake } = makeSut()
      sut.markAggregateForDispatch(aggregateFake)

      sut.clearMarkedAggregates()

      expect(sut.markedAggregates).toEqual([])
    })

    it('clears handlers', () => {
      const { sut, aggregateFake, handlerFake } = makeSut()
      sut.markAggregateForDispatch(aggregateFake)
      sut.register('DomainEventFake', handlerFake)

      sut.clearHandlers()

      expect(sut.handlers).toEqual({})
    })
  })
})
