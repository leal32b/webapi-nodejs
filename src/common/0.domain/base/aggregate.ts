export abstract class Aggregate<AggregateRootType> {
  protected constructor (protected readonly _aggregateRoot: AggregateRootType) {}

  abstract get aggregateRoot (): Record<string, any>
}
