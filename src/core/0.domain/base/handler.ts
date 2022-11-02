import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { DomainEvents } from '@/core/0.domain/events/domain-events'

export abstract class Handler<ConstructParamsType> {
  protected constructor (protected readonly props: ConstructParamsType) {}

  protected setupSubscriptions (eventName: string, callback: (event: DomainEvent<any>) => void): void {
    DomainEvents.register(eventName, callback)
  }
}
