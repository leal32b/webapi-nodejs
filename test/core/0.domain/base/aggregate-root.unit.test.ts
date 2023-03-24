import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { Identifier } from '@/core/0.domain/utils/identifier'

type PropsFake = {
  anyKey: string
}

class AggregateRootStub extends AggregateRoot<PropsFake> {
  public static create (props: any): AggregateRootStub {
    return new AggregateRootStub(props)
  }
}

type SutTypes = {
  sut: AggregateRootStub
}

const makeSut = (): SutTypes => {
  const sut = AggregateRootStub.create({ anyKey: 'any_value' })

  return { sut }
}

describe('AggregateRoot', () => {
  describe('success', () => {
    it('gets the id', () => {
      const { sut } = makeSut()

      const result = sut.id

      expect(result).toBeInstanceOf(Identifier)
    })
  })
})
