import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { Identifier } from '@/core/0.domain/utils/identifier'

import { makeDomainEventStub } from '~/stubs/domain-event-stub'

type ConstructParamsFake = {
  anyKey: string
}

type PayloadFake = {
  anyKey: string
}

class AggregateRootStub extends AggregateRoot<ConstructParamsFake> {
  public static create (params: any): AggregateRootStub {
    return new AggregateRootStub(params)
  }

  testAddEvent (event: DomainEvent<PayloadFake>): void {
    this.addEvent(event)
  }
}

type SutTypes = {
  sut: AggregateRootStub
  domainEventStub: DomainEvent<any>
}

const makeSut = (): SutTypes => {
  const doubles = {
    domainEventStub: makeDomainEventStub()
  }
  const sut = AggregateRootStub.create({ anyKey: 'any_value' })

  return { sut, ...doubles }
}

describe('AggregateRoot', () => {
  describe('success', () => {
    it('adds an events', () => {
      const { sut, domainEventStub } = makeSut()
      sut.testAddEvent(domainEventStub)

      const result = sut.events

      expect(result[0]).instanceOf(DomainEvent)
    })

    it('clears the events', () => {
      const { sut, domainEventStub } = makeSut()
      sut.testAddEvent(domainEventStub)
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
      const { sut, domainEventStub } = makeSut()
      sut.testAddEvent(domainEventStub)

      const result = sut.events

      expect(result.every(item => item instanceof DomainEvent)).toBe(true)
    })
  })
})
