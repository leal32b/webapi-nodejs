import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either, right } from '@/core/0.domain/utils/either'

import { makeDomainEventStub } from '~/core/stubs/domain-event-stub'

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
