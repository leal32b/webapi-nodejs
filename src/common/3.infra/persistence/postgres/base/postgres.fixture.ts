import { type IntegerGreaterThanZeroType } from '@/common/0.domain/types/integer-greater-than-zero.type'
import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence.fixture'
import { persistence } from '@/common/4.main/container'

type Props<ReturnType> = {
  createDefault: () => ReturnType
  repositoryName: string
}

export abstract class PostgresFixture<EntityType> implements PersistenceFixture<EntityType> {
  protected constructor (private readonly props: Props<EntityType>) {}

  public async createFixture (entity?: Partial<EntityType>): Promise<EntityType>
  public async createFixture (entities: Array<Partial<EntityType>>): Promise<EntityType[]>
  public async createFixture <NumberType extends number>(amount: IntegerGreaterThanZeroType<NumberType>): Promise<EntityType[]>
  public async createFixture <NumberType extends number>(entityOrEntitiesOrAmount: Partial<EntityType> | Array<Partial<EntityType>> | IntegerGreaterThanZeroType<NumberType>): Promise<EntityType | EntityType[] | EntityType[]> {
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

    if (!entityOrEntitiesOrAmount || !Array.isArray(entityOrEntitiesOrAmount)) {
      const entity = repository.create({
        ...createDefault(),
        ...entityOrEntitiesOrAmount
      })
      await persistence.postgres.client.manager.save(entity)

      return entity
    }

    const entities = entityOrEntitiesOrAmount.map(entity => repository.create({
      ...createDefault(),
      ...entity
    }))
    await persistence.postgres.client.manager.save(entities)

    return entities
  }
}
