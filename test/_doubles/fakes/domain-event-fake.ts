import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { Identifier } from '@/core/0.domain/utils/identifier'

export const makeDomainEventFake = (): DomainEvent<any> => {
  class DomainEventFake extends DomainEvent<any> {
    public static create (): DomainEventFake {
      return new DomainEventFake({
        aggregateId: Identifier.create(),
        payload: {
          anyKey: 'any_value'
        }
      })
    }
  }

  return DomainEventFake.create()
}
