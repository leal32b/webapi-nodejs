import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { Identifier } from '@/core/0.domain/utils/identifier'

export class DomainEvents {
  private static _handlers = {}
  private static _markedAggregates: Array<AggregateRoot<any>> = []

  public static clearHandlers (): void {
    this._handlers = {}
  }

  public static clearMarkedAggregates (): void {
    this._markedAggregates = []
  }

  public static dispatchEventsForAggregate (id: Identifier): void {
    const markedAggregate = this.findMarkedAggregateById(id)

    if (!markedAggregate) {
      return
    }

    this.dispatchAggregateEvents(markedAggregate)
    this.removeAggregateFromMarkedAggregates(markedAggregate)
    markedAggregate.clearEvents()
  }

  public static markAggregateForDispatch (aggregate: AggregateRoot<any>): void {
    const markedAggregate = this.findMarkedAggregateById(aggregate.id)

    if (markedAggregate) {
      return
    }

    this.markedAggregates.push(aggregate)
  }

  public static register (eventName: string, callback: (event: DomainEvent<any>) => void): void {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = []
    }

    this.handlers[eventName].push(callback)
    console.log(`${eventName} registered`)
  }

  public static get handlers (): Object {
    return this._handlers
  }

  public static get markedAggregates (): Array<AggregateRoot<any>> {
    return this._markedAggregates
  }

  private static dispatch (event: DomainEvent<any>): void {
    const eventClassName = event.constructor.name
    const handlers = this.handlers[eventClassName]

    if (!handlers) {
      return
    }

    handlers.forEach(handler => handler(event))
  }

  private static dispatchAggregateEvents (aggregate: AggregateRoot<any>): void {
    aggregate.events.forEach(event => this.dispatch(event))
  }

  private static findMarkedAggregateById (id: Identifier): AggregateRoot<any> {
    return this.markedAggregates.find(a => a.id.value === id.value)
  }

  private static removeAggregateFromMarkedAggregates (aggregate: AggregateRoot<any>): void {
    const index = this.markedAggregates.findIndex((a) => a.id.value === aggregate.id.value)

    this.markedAggregates.splice(index, 1)
  }
}
