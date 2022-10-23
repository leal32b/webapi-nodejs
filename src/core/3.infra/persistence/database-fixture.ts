import { IntegerGreaterThanZero } from '@/core/0.domain/types/integer-greater-than-zero'

export interface DatabaseFixture<T> {
  createFixture: (entity: Partial<T>) => Promise<T>
  createFixtures: (entities: Array<Partial<T>>) => Promise<T[]>
  createRandomFixture: () => Promise<T>
  createRandomFixtures: <N extends number>(amount: IntegerGreaterThanZero<N>) => Promise<T[]>
}
