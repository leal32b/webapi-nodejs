import { Identifier } from '@/core/0.domain/utils/identifier'

type ConstructorParams<T> = {
  aggregateId: Identifier
  payload: T
}

export abstract class DomainEvent<T> {
  private readonly _createdAt: Date

  constructor (private readonly props: ConstructorParams<T>) {
    this._createdAt = new Date()
  }

  get aggregateId (): Identifier {
    return this.props.aggregateId
  }

  get createdAt (): Date {
    return this._createdAt
  }

  get payload (): T {
    return this.props.payload
  }
}
