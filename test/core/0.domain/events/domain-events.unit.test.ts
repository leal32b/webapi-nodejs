import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { DomainEvents } from '@/core/0.domain/events/domain-events'

import { makeAggregateStub } from '~/core/stubs/aggregate-stub'

type SutTypes = {
  sut: typeof DomainEvents
  aggregateStub: AggregateRoot<any>
  handlerStub: (event: DomainEvent<any>) => void
}

const makeSut = (): SutTypes => {
  const doubles = {
    aggregateStub: makeAggregateStub(),
    handlerStub: vi.fn()
  }
  const sut = DomainEvents

  return { sut, ...doubles }
}

describe('DomainEvents', () => {
  describe('success', () => {
    it('register callbacks for an eventClassName', () => {
      const { sut, handlerStub } = makeSut()

      sut.register('DomainEventStub', handlerStub)

      expect(sut.handlers).toEqual({ DomainEventStub: expect.any(Array) })
    })

    it('marks an aggregate to dispatch', () => {
      const { sut, aggregateStub } = makeSut()

      sut.markAggregateForDispatch(aggregateStub)

      expect(sut.markedAggregates.every(item => item instanceof AggregateRoot)).toBe(true)
    })

    it('returns when there is no aggregate to dispatch events on dispatchEventsForAggregate', () => {
      const { sut, aggregateStub } = makeSut()
      const clearEventsSpy = vi.spyOn(aggregateStub, 'clearEvents')
      sut.clearMarkedAggregates()

      sut.dispatchEventsForAggregate(aggregateStub.id)

      expect(clearEventsSpy).not.toBeCalled()
    })

    it('returns when there is no handler to execute on dispatchEventsForAggregate', () => {
      const { sut, aggregateStub, handlerStub } = makeSut()
      sut.clearHandlers()

      sut.dispatchEventsForAggregate(aggregateStub.id)

      expect(handlerStub).not.toBeCalled()
    })

    it('dispatches events for aggregate', () => {
      const { sut, aggregateStub, handlerStub } = makeSut()
      sut.markAggregateForDispatch(aggregateStub)
      sut.register('DomainEventStub', handlerStub)

      sut.dispatchEventsForAggregate(aggregateStub.id)

      expect(handlerStub).toBeCalled()
    })

    it('removes aggregate from markedAggregates on dispatchEventsForAggregate', () => {
      const { sut, aggregateStub } = makeSut()
      sut.markAggregateForDispatch(aggregateStub)

      sut.dispatchEventsForAggregate(aggregateStub.id)

      expect(sut.markedAggregates).toEqual([])
    })

    it('calls aggregate.clearEvents on dispatchEventsForAggregate', () => {
      const { sut, aggregateStub } = makeSut()
      sut.markAggregateForDispatch(aggregateStub)

      sut.dispatchEventsForAggregate(aggregateStub.id)

      expect(aggregateStub.events).toEqual([])
    })

    it('clears markedAggregates', () => {
      const { sut, aggregateStub } = makeSut()
      sut.markAggregateForDispatch(aggregateStub)

      sut.clearMarkedAggregates()

      expect(sut.markedAggregates).toEqual([])
    })

    it('clears handlers', () => {
      const { sut, aggregateStub, handlerStub } = makeSut()
      sut.markAggregateForDispatch(aggregateStub)
      sut.register('DomainEventStub', handlerStub)

      sut.clearHandlers()

      expect(sut.handlers).toEqual({})
    })
  })
})
