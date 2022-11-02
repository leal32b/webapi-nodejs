import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { Identifier } from '@/core/0.domain/utils/identifier'

export const makeDomainEventStub = (): DomainEvent<any> => {
  class DomainEventStub extends DomainEvent<any> {
    public static create (): DomainEventStub {
      return new DomainEventStub({
        aggregateId: Identifier.create(),
        payload: {
          anyKey: 'any_value'
        }
      })
    }
  }

  return DomainEventStub.create()
}
