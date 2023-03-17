import { type AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { type DomainEvent } from '@/core/0.domain/base/domain-event'
import { type Identifier } from '@/core/0.domain/utils/identifier'

type RegisteredHandler = {
  callback: (event: DomainEvent<any>) => void
  name: string
}

type RegisterParams = {
  handlerName: string
  eventName: string
  callback: (event: DomainEvent<any>) => void
}

export class DomainEvents {
  private static _handlers: Record<string, RegisteredHandler[]> = {}
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

  public static register (registerParams: RegisterParams): void {
    const { callback, eventName, handlerName } = registerParams

    if (!this.handlers[eventName]) {
      this.handlers[eventName] = []
    }

    this.handlers[eventName].push({
      callback,
      name: handlerName
    })

    console.info(`handler registered: [${eventName}] ${handlerName}`)
  }

  public static get handlers (): Record<string, RegisteredHandler[]> {
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

    handlers.forEach(handler => {
      handler.callback(event)

      console.info(`handler executed: [${event.constructor.name}] ${handler.name}`, {
        aggregateId: event.aggregateId.value,
        payload: event.payload
      })
    })
  }

  private static dispatchAggregateEvents (aggregate: AggregateRoot<any>): void {
    aggregate.events.forEach(event => { this.dispatch(event) })
  }

  private static findMarkedAggregateById (id: Identifier): AggregateRoot<any> {
    return this.markedAggregates.find(a => a.id.value === id.value)
  }

  private static removeAggregateFromMarkedAggregates (aggregate: AggregateRoot<any>): void {
    const index = this.markedAggregates.findIndex((a) => a.id.value === aggregate.id.value)

    this.markedAggregates.splice(index, 1)
  }
}
