import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'

type Props<T> = {
  createDefault: () => T
  repositoryName: string
}

type IntegerGreaterThanZero<T extends number> =
    number extends T
      ? never
      : `${T}` extends `-${string}` | '0' | `${string}.${string}`
        ? never
        : T

export abstract class PgFactory<T> {
  protected constructor (private readonly props: Props<T>) {}

  async createFixtures (): Promise<T>
  async createFixtures (entity: Partial<T>): Promise<T>
  async createFixtures (entities: Array<Partial<T>>): Promise<T[]>
  async createFixtures <N extends number>(amount: IntegerGreaterThanZero<N>): Promise<T[]>
  async createFixtures <N extends number>(amountOrEntityOrEntities?: IntegerGreaterThanZero<N> | Partial<T> | Array<Partial<T>>): Promise<T | T[]> {
    const { createDefault, repositoryName } = this.props
    const repository = await pg.client.getRepository(repositoryName)

    if (typeof amountOrEntityOrEntities === 'number') {
      const entities: T[] = []

      for (let i = 0; i < amountOrEntityOrEntities; i++) {
        entities.push(createDefault())
      }

      await pg.client.manager.save(entities)

      return entities
    }

    if (!Array.isArray(amountOrEntityOrEntities)) {
      const entity = repository.create({ ...createDefault(), ...amountOrEntityOrEntities })
      await pg.client.manager.save(entity)

      return entity
    }

    const entities = amountOrEntityOrEntities.map(entity => ({ ...createDefault(), ...entity }))
    await pg.client.manager.save(entities)

    return entities
  }
}
