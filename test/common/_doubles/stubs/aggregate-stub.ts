import { AggregateRoot } from '@/common/0.domain/base/aggregate-root'
import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, right } from '@/common/0.domain/utils/either'

export const makeAggregateStub = (): AggregateRoot<any> => {
  class AggregateStub extends AggregateRoot<any> {
    public static create (): Either<DomainError[], AggregateStub> {
      const aggregateStub = new AggregateStub({ anyKey: 'any_value' })

      return right(aggregateStub)
    }
  }

  return AggregateStub.create().value as AggregateStub
}
