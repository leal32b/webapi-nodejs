import { Identifier } from '@/core/0.domain/utils/identifier'

export abstract class DomainEvent {
  private readonly createdAt: Date

  constructor (private readonly _aggregateId: Identifier) {
    this.createdAt = new Date()
  }

  get aggregateId (): Identifier {
    return this._aggregateId
  }
}
