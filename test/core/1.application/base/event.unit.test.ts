import { Event } from '@/core/1.application/base/event'

type PayloadFake = {
  anyKey: string
}

class EventStub extends Event<PayloadFake> {
  public static create (): EventStub {
    return new EventStub({
      aggregateId: 'any_id',
      createdAt: new Date(),
      payload: {
        anyKey: 'any_value'
      }
    })
  }
}

type SutTypes = {
  sut: EventStub
}

const makeSut = (): SutTypes => {
  const sut = EventStub.create()

  return { sut }
}

describe('DomainEvent', () => {
  describe('success', () => {
    it('gets aggregateId', () => {
      const { sut } = makeSut()

      const result = sut.aggregateId

      expect(result).toBe('any_id')
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
