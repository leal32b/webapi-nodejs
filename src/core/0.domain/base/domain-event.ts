import { type Identifier } from '@/core/0.domain/utils/identifier'

export type DomainEventProps<PayloadType> = {
  aggregateId: Identifier
  payload: PayloadType
}

export abstract class DomainEvent<PayloadType> {
  private readonly _createdAt: Date

  protected constructor (private readonly props: DomainEventProps<PayloadType>) {
    this._createdAt = new Date()
  }

  public get aggregateId (): Identifier {
    return this.props.aggregateId
  }

  public get createdAt (): Date {
    return this._createdAt
  }

  public get payload (): PayloadType {
    return this.props.payload
  }
}
