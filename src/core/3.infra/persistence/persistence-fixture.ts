import { type IntegerGreaterThanZero } from '@/core/0.domain/types/integer-greater-than-zero'

export interface PersistenceFixture<EntityType> {
  createFixture: (entity: Partial<EntityType>) => Promise<EntityType>
  createFixtures: (entities: Array<Partial<EntityType>>) => Promise<EntityType[]>
  createRandomFixture: () => Promise<EntityType>
  createRandomFixtures: <NumberType extends number>(amount: IntegerGreaterThanZero<NumberType>) => Promise<EntityType[]>
}
