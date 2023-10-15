import { Aggregate } from '@/common/0.domain/base/aggregate'
import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, right } from '@/common/0.domain/utils/either'

export const makeAggregateStub = (): Aggregate<any, any> => {
  class AggregateStub extends Aggregate<any, any> {
    public static create (): Either<DomainError[], AggregateStub> {
      const aggregateStub = new AggregateStub({ anyKey: 'any_value' }, {})

      return right(aggregateStub)
    }

    get aggregateRoot (): typeof this._aggregateRoot.props {
      return this._aggregateRoot.props
    }
  }

  return AggregateStub.create().value as AggregateStub
}
