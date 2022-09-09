import { Aggregate } from '@/core/0.domain/base/aggregate'

type aggregateRootFake = {
  anyKey: any
}

const makeAggregateRootFake = (): aggregateRootFake => ({
  anyKey: null
})

class AggregateFake extends Aggregate<aggregateRootFake> {}

type SutTypes = {
  sut: Aggregate<any>
}

const makeSut = (): SutTypes => {
  const params = {
    aggregateRoot: makeAggregateRootFake()
  }

  const sut = new AggregateFake(params)

  return { sut, ...params }
}

describe('Aggregate', () => {
  describe('success', () => {
    it('gets the aggregateRoot', () => {
      const { sut } = makeSut()

      const result = sut.aggregateRoot

      expect(result).toEqual({ anyKey: null })
    })
  })
})
