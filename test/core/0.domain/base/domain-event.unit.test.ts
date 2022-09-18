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

class EventFake extends DomainEvent {}

type SutTypes = {
  sut: EventFake
  aggregateFake: UserAggregate
}

const makeSut = (): SutTypes => {
  const aggregateFake = makeAggregateFake()
  const sut = new EventFake(aggregateFake.id)

  return { sut, aggregateFake }
}

describe('DomainEvent', () => {
  describe('success', () => {
    it('gets the aggregateId', () => {
      const { sut } = makeSut()

      const result = sut.aggregateId

      expect(result).toBeInstanceOf(Identifier)
    })
  })
})
