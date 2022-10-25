import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { DomainEvent } from '@/core/0.domain/base/domain-event'
import { Identifier } from '@/core/0.domain/utils/identifier'

export class DomainEvents {
  private static _handlers = {}
  private static _markedAggregates: Array<AggregateRoot<any>> = []

  private static findMarkedAggregateById (id: Identifier): AggregateRoot<any> {
    return this.markedAggregates.find(a => a.id.value === id.value)
  }

  private static dispatchAggregateEvents (aggregate: AggregateRoot<any>): void {
    aggregate.events.forEach(event => this.dispatch(event))
  }

  private static dispatch (event: DomainEvent<any>): void {
    const eventClassName = event.constructor.name
    const handlers = this.handlers[eventClassName]

    if (!handlers) {
      return
    }

    handlers.forEach(handler => handler(event))
  }

  private static removeAggregateFromMarkedAggregates (aggregate: AggregateRoot<any>): void {
    const index = this.markedAggregates.findIndex((a) => a.id.value === aggregate.id.value)

    this.markedAggregates.splice(index, 1)
  }

  static register (callback: (event: DomainEvent<any>) => void, eventClassName: string): void {
    if (!this.handlers[eventClassName]) {
      this.handlers[eventClassName] = []
    }

    this.handlers[eventClassName].push(callback)
    console.log(`handler for ${eventClassName}`)
  }

  static markAggregateForDispatch (aggregate: AggregateRoot<any>): void {
    const aggregateFound = this.findMarkedAggregateById(aggregate.id)

    if (aggregateFound) {
      return
    }

    this.markedAggregates.push(aggregate)
  }

  static dispatchEventsForAggregate (id: Identifier): void {
    const aggregate = this.findMarkedAggregateById(id)

    if (!aggregate) {
      return
    }

    this.dispatchAggregateEvents(aggregate)
    this.removeAggregateFromMarkedAggregates(aggregate)
    aggregate.clearEvents()
  }

  static clearMarkedAggregates (): void {
    this._markedAggregates = []
  }

  static clearHandlers (): void {
    this._handlers = {}
  }

  static get markedAggregates (): Array<AggregateRoot<any>> {
    return this._markedAggregates
  }

  static get handlers (): Object {
    return this._handlers
  }
}
