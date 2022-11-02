import { Identifier } from '@/core/0.domain/utils/identifier'

export type DomainEventConstructorParams<T> = {
  aggregateId: Identifier
  payload: T
}

export abstract class DomainEvent<T> {
  private readonly _createdAt: Date

  protected constructor (private readonly props: DomainEventConstructorParams<T>) {
    this._createdAt = new Date()
  }

  public get aggregateId (): Identifier {
    return this.props.aggregateId
  }

  public get createdAt (): Date {
    return this._createdAt
  }

  public get payload (): T {
    return this.props.payload
  }
}
