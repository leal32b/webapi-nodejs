export type Props<PayloadType> = {
  aggregateId: string
  payload: PayloadType
  createdAt?: Date
}

export abstract class Event<PayloadType> {
  protected constructor (private readonly props: Props<PayloadType>) {
    props.createdAt = new Date()
  }

  public get aggregateId (): string {
    return this.props.aggregateId
  }

  public get createdAt (): Date {
    return this.props.createdAt
  }

  public get payload (): PayloadType {
    return this.props.payload
  }
}
