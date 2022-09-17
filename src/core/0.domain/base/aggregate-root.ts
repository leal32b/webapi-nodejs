import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { Entity } from '@/core/0.domain/base/entity'
import { DomainEvents } from '@/core/0.domain/events/domain-events'
import { Identifier } from '@/core/0.domain/utils/identifier'

export abstract class AggregateRoot<T> extends Entity<T> {
  private readonly _events: DomainEvent[] = []

  protected addEvent (event: DomainEvent): void {
    this._events.push(event)
    DomainEvents.markAggregateForDispatch(this)
  }

  private logDomainEventAdded (domainEvent: DomainEvent): void {

  }

  clearEvents (): void {
    this._events.splice(0, this._events.length)
  }

  get id (): Identifier {
    return this.props.id
  }

  get events (): DomainEvent[] {
    return this._events
  }
}
