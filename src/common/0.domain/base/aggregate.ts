import { type ValueObject } from '@/common/0.domain/base/value-object'

export abstract class Aggregate<AggregateRootType> {
  protected constructor (protected readonly _aggregateRoot: AggregateRootType) {}

  abstract get aggregateRoot (): Record<string, ValueObject<any>>
}
