export abstract class Aggregate<T> {
  constructor (protected readonly props: { aggregateRoot: T }) {}

  get aggregateRoot (): T {
    return this.props.aggregateRoot
  }
}
