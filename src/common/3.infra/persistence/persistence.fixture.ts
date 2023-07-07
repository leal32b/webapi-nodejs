import { type IntegerGreaterThanZeroType } from '@/common/0.domain/types/integer-greater-than-zero.type'

export interface PersistenceFixture<EntityType> {
  createFixture: (entity: Partial<EntityType>) => Promise<EntityType>
  createFixtures: (entities: Array<Partial<EntityType>>) => Promise<EntityType[]>
  createRandomFixture: () => Promise<EntityType>
  createRandomFixtures: <NumberType extends number>(amount: IntegerGreaterThanZeroType<NumberType>) => Promise<EntityType[]>
}
