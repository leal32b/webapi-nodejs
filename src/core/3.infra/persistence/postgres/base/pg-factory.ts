import { IntegerGreaterThanZero } from '@/core/0.domain/types/integer-greater-than-zero'
import { DatabaseFactory } from '@/core/3.infra/persistence/database-factory'
import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'

type Props<T> = {
  createDefault: () => T
  repositoryName: string
}

export abstract class PgFactory<T> implements DatabaseFactory<T> {
  protected constructor (private readonly props: Props<T>) {}

  private async create (): Promise<T>
  private async create (entity: Partial<T>): Promise<T>
  private async create (entities: Array<Partial<T>>): Promise<T[]>
  private async create <N extends number>(amount: IntegerGreaterThanZero<N>): Promise<T[]>
  private async create <N extends number>(amountOrEntityOrEntities?: IntegerGreaterThanZero<N> | Partial<T> | Array<Partial<T>>): Promise<T | T[]> {
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

  async createFixture (entity: Partial<T>): Promise<T> {
    return await this.create(entity)
  }

  async createFixtures (entities: Array<Partial<T>>): Promise<T[]> {
    return await this.create(entities)
  }

  async createRandomFixture (): Promise<T> {
    return await this.create()
  }

  async createRandomFixtures <N extends number>(amount: IntegerGreaterThanZero<N>): Promise<T[]> {
    return await this.create(amount)
  }
}
