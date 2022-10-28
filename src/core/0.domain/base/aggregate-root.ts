import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { Entity } from '@/core/0.domain/base/entity'
import { DomainEvents } from '@/core/0.domain/events/domain-events'
import { Identifier } from '@/core/0.domain/utils/identifier'

export abstract class AggregateRoot<ParamsType> extends Entity<ParamsType> {
  private readonly _events: Array<DomainEvent<any>> = []

  public clearEvents (): void {
    this._events.splice(0, this._events.length)
  }

  protected addEvent (event: DomainEvent<any>): void {
    this._events.push(event)
    DomainEvents.markAggregateForDispatch(this)
  }

  get events (): Array<DomainEvent<any>> {
    return this._events
  }

  get id (): Identifier {
    return this.props.id
  }
}
