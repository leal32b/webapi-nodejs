import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { Identifier } from '@/core/0.domain/utils/identifier'

type PayloadFake = {
  anyKey: string
}

class DomainEventFake extends DomainEvent<PayloadFake> {
  public static create (): DomainEventFake {
    return new DomainEventFake({
      aggregateId: Identifier.create(),
      payload: {
        anyKey: 'any_value'
      }
    })
  }
}

type SutTypes = {
  sut: DomainEventFake
}

const makeSut = (): SutTypes => {
  const sut = DomainEventFake.create()

  return { sut }
}

describe('DomainEvent', () => {
  describe('success', () => {
    it('gets aggregateId', () => {
      const { sut } = makeSut()

      const result = sut.aggregateId

      expect(result).toBeInstanceOf(Identifier)
    })

    it('gets createdAt', () => {
      const { sut } = makeSut()

      const result = sut.createdAt

      expect(result).toBeInstanceOf(Date)
    })

    it('gets payload', () => {
      const { sut } = makeSut()

      const result = sut.payload

      expect(result).toEqual({
        anyKey: 'any_value'
      })
    })
  })
})
