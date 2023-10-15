export abstract class Aggregate<AggregateRootType, AdditionalType> {
  protected constructor (
    protected readonly _aggregateRoot: AggregateRootType,
    protected readonly _additional: AdditionalType
  ) {}

  abstract get aggregateRoot (): Record<string, any>
}
