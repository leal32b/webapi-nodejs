import { IntegerGreaterThanZero } from '@/core/0.domain/types/integer-greater-than-zero'
import { DatabaseFixture } from '@/core/3.infra/persistence/database-fixture'
import { persistence } from '@/core/4.main/container'

type Props<T> = {
  createDefault: () => T
  repositoryName: string
}

export abstract class PostgresFixture<T> implements DatabaseFixture<T> {
  protected constructor (private readonly props: Props<T>) {}

  private async create (): Promise<T>
  private async create (entity: Partial<T>): Promise<T>
  private async create (entities: Array<Partial<T>>): Promise<T[]>
  private async create <N extends number>(amount: IntegerGreaterThanZero<N>): Promise<T[]>
  private async create <N extends number>(entityOrEntitiesOrAmount?: IntegerGreaterThanZero<N> | Partial<T> | Array<Partial<T>>): Promise<T | T[]> {
    const { createDefault, repositoryName } = this.props
    const repository = await persistence.postgres.client.getRepository(repositoryName)

    if (typeof entityOrEntitiesOrAmount === 'number') {
      const entities: T[] = []

      for (let i = 0; i < entityOrEntitiesOrAmount; i++) {
        entities.push(repository.create(createDefault()))
      }

      await persistence.postgres.client.manager.save(entities)

      return entities
    }

    if (!Array.isArray(entityOrEntitiesOrAmount)) {
      const entity = repository.create({ ...createDefault(), ...entityOrEntitiesOrAmount })
      await persistence.postgres.client.manager.save(entity)

      return entity
    }

    const entities = entityOrEntitiesOrAmount.map(entity => repository.create({ ...createDefault(), ...entity }))
    await persistence.postgres.client.manager.save(entities)

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
