import { type IntegerGreaterThanZeroType } from '@/common/0.domain/types/integer-greater-than-zero.type'

interface CreateFixture<EntityType> {
  (entity?: Partial<EntityType>): Promise<EntityType>
  (entities: Array<Partial<EntityType>>): Promise<EntityType[]>
  <NumberType extends number>(amount: IntegerGreaterThanZeroType<NumberType>): Promise<EntityType[]>
}

export interface PersistenceFixture<EntityType> {
  createFixture: CreateFixture<EntityType>
}
