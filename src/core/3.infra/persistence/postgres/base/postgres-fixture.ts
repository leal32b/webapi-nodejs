import { type IntegerGreaterThanZero } from '@/core/0.domain/types/integer-greater-than-zero'
import { type DatabaseFixture } from '@/core/3.infra/persistence/database-fixture'
import { persistence } from '@/core/4.main/container'

type Props<ReturnType> = {
  createDefault: () => ReturnType
  repositoryName: string
}

export abstract class PostgresFixture<EntityType> implements DatabaseFixture<EntityType> {
  protected constructor (private readonly props: Props<EntityType>) {}

  public async createFixture (entity: Partial<EntityType>): Promise<EntityType> {
    return await this.createPostgresFixture(entity)
  }

  public async createFixtures (entities: Array<Partial<EntityType>>): Promise<EntityType[]> {
    return await this.createPostgresFixture(entities)
  }

  public async createRandomFixture (): Promise<EntityType> {
    return await this.createPostgresFixture()
  }

  public async createRandomFixtures <NumberType extends number>(amount: IntegerGreaterThanZero<NumberType>): Promise<EntityType[]> {
    return await this.createPostgresFixture(amount)
  }

  private async createPostgresFixture (): Promise<EntityType>
  private async createPostgresFixture (entity: Partial<EntityType>): Promise<EntityType>
  private async createPostgresFixture (entities: Array<Partial<EntityType>>): Promise<EntityType[]>
  private async createPostgresFixture <NumberType extends number>(amount: IntegerGreaterThanZero<NumberType>): Promise<EntityType[]>
  private async createPostgresFixture <NumberType extends number>(entityOrEntitiesOrAmount?: IntegerGreaterThanZero<NumberType> | Partial<EntityType> | Array<Partial<EntityType>>): Promise<EntityType | EntityType[]> {
    const { createDefault, repositoryName } = this.props
    const repository = await persistence.postgres.client.getRepository(repositoryName)

    if (typeof entityOrEntitiesOrAmount === 'number') {
      const entities: EntityType[] = []

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
}
