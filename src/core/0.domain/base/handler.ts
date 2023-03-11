import { type DomainEvent } from '@/core/0.domain/base/domain-event'
import { DomainEvents } from '@/core/0.domain/events/domain-events'

export abstract class Handler<PropsType> {
  protected constructor (protected readonly props: PropsType) {}

  protected setupSubscriptions (eventName: string, callback: (event: DomainEvent<any>) => void): void {
    DomainEvents.register(eventName, callback)
  }
}
