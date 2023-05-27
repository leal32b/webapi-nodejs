import { Entity } from '@/common/0.domain/base/entity'
import { type Identifier } from '@/common/0.domain/utils/identifier'

export abstract class AggregateRoot<ParamsType> extends Entity<ParamsType> {
  public get id (): Identifier {
    return this.props.id
  }
}
