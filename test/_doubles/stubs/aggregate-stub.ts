import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, right } from '@/core/0.domain/utils/either'

import { makeDomainEventStub } from '~/stubs/domain-event-stub'

export const makeAggregateStub = (): AggregateRoot<any> => {
  class AggregateStub extends AggregateRoot<any> {
    public static create (): Either<DomainError[], AggregateStub> {
      const aggregateStub = new AggregateStub({ anyKey: 'any_value' })
      aggregateStub.addEvent(makeDomainEventStub())

      return right(aggregateStub)
    }
  }

  return AggregateStub.create().value as AggregateStub
}
