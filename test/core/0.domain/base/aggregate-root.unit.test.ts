import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { Identifier } from '@/core/0.domain/utils/identifier'

import { makeDomainEventFake } from '~/doubles/fakes/domain-event-fake'

type ConstructParamsFake = {
  anyKey: string
}

type PayloadFake = {
  anyKey: string
}

class AggregateRootFake extends AggregateRoot<ConstructParamsFake> {
  public static create (params: any): AggregateRootFake {
    return new AggregateRootFake(params)
  }

  testAddEvent (event: DomainEvent<PayloadFake>): void {
    this.addEvent(event)
  }
}

type SutTypes = {
  sut: AggregateRootFake
  domainEventFake: DomainEvent<any>
}

const makeSut = (): SutTypes => {
  const doubles = {
    domainEventFake: makeDomainEventFake()
  }
  const sut = AggregateRootFake.create({ anyKey: 'any_value' })

  return { sut, ...doubles }
}

describe('AggregateRoot', () => {
  describe('success', () => {
    it('adds an events', () => {
      const { sut, domainEventFake } = makeSut()
      sut.testAddEvent(domainEventFake)

      const result = sut.events

      expect(result[0]).instanceOf(DomainEvent)
    })

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
