import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, right } from '@/core/0.domain/utils/either'

import { makeDomainEventFake } from '~/doubles/fakes/domain-event-fake'

export const makeAggregateFake = (): AggregateRoot<any> => {
  class AggregateFake extends AggregateRoot<any> {
    public static create (): Either<DomainError[], AggregateFake> {
      const aggregateFake = new AggregateFake({ anyKey: 'any_value' })
      aggregateFake.addEvent(makeDomainEventFake())

      return right(aggregateFake)
    }
  }

  return AggregateFake.create().value as AggregateFake
}
