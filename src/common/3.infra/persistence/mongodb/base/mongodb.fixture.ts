import { ObjectId } from 'mongodb'

import { type IntegerGreaterThanZeroType } from '@/common/0.domain/types/integer-greater-than-zero.type'
import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence.fixture'
import { persistence } from '@/common/4.main/container'

type Props<ReturnType> = {
  createDefault: () => ReturnType
  collectionName: string
}

export abstract class MongodbFixture<EntityType> implements PersistenceFixture<EntityType> {
  protected constructor (private readonly props: Props<EntityType>) {}

  public async createFixture (entity?: Partial<EntityType>): Promise<EntityType>
  public async createFixture (entities: Array<Partial<EntityType>>): Promise<EntityType[]>
  public async createFixture <NumberType extends number>(amount: IntegerGreaterThanZeroType<NumberType>): Promise<EntityType[]>
  public async createFixture <NumberType extends number>(entityOrEntitiesOrAmount: Partial<EntityType> | Array<Partial<EntityType>> | IntegerGreaterThanZeroType<NumberType>): Promise<EntityType | EntityType[] | EntityType[]> {
    const { createDefault, collectionName } = this.props
    const collection = await persistence.mongodb.client.getCollection(collectionName)

    if (typeof entityOrEntitiesOrAmount === 'number') {
      const entities: EntityType[] = []

      for (let i = 0; i < entityOrEntitiesOrAmount; i++) {
        entities.push(createDefault())
      }

      await collection.insertMany(entities.map(entity => this.adaptId(entity)))

      return entities
    }

    if (!entityOrEntitiesOrAmount || !Array.isArray(entityOrEntitiesOrAmount)) {
      const entity = {
        ...createDefault(),
        ...entityOrEntitiesOrAmount
      }
      await collection.insertOne(this.adaptId(entity))

      return entity
    }

    const entities = entityOrEntitiesOrAmount.map(entity => ({
      ...createDefault(),
      ...entity
    }))
    await collection.insertMany(entities.map(entity => this.adaptId(entity)))

    return entities
  }

  private adaptId (entity: any): EntityType {
    const { id, ...entityWithoutId } = entity

    return {
      ...entityWithoutId,
      _id: new ObjectId(id)
    }
  }
}
