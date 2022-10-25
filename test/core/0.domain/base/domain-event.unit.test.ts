import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { Identifier } from '@/core/0.domain/utils/identifier'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'

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

class EventFake extends DomainEvent<PayloadFake> {}

type SutTypes = {
  sut: EventFake
  aggregateFake: UserAggregate
}

const makeSut = (): SutTypes => {
  const aggregateFake = makeAggregateFake()
  const sut = new EventFake({
    aggregateId: aggregateFake.id,
    payload: {
      anyKey: 'any_value'
    }
  })

  return { sut, aggregateFake }
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
