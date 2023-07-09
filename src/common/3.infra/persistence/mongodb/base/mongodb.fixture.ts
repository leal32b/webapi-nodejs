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

  public async createFixture (entity: Partial<EntityType>): Promise<EntityType> {
    return await this.createMongodbFixture(entity)
  }

  public async createFixtures (entities: Array<Partial<EntityType>>): Promise<EntityType[]> {
    return await this.createMongodbFixture(entities)
  }

  public async createRandomFixture (): Promise<EntityType> {
    return await this.createMongodbFixture()
  }

  public async createRandomFixtures <NumberType extends number>(amount: IntegerGreaterThanZeroType<NumberType>): Promise<EntityType[]> {
    return await this.createMongodbFixture(amount)
  }

  private adaptId (entity: any): EntityType {
    const { id, ...entityWithoutId } = entity

    return {
      ...entityWithoutId,
      _id: new ObjectId(id)
    }
  }

  private async createMongodbFixture (): Promise<EntityType>
  private async createMongodbFixture (entity: Partial<EntityType>): Promise<EntityType>
  private async createMongodbFixture (entities: Array<Partial<EntityType>>): Promise<EntityType[]>
  private async createMongodbFixture <NumberType extends number>(amount: IntegerGreaterThanZeroType<NumberType>): Promise<EntityType[]>
  private async createMongodbFixture <NumberType extends number>(amountOrEntityOrEntities?: IntegerGreaterThanZeroType<NumberType> | Partial<EntityType> | Array<Partial<EntityType>>): Promise<EntityType | EntityType[]> {
    const { createDefault, collectionName } = this.props
    const collection = await persistence.mongodb.client.getCollection(collectionName)

    if (typeof amountOrEntityOrEntities === 'number') {
      const entities: EntityType[] = []

      for (let i = 0; i < amountOrEntityOrEntities; i++) {
        entities.push(createDefault())
      }

      await collection.insertMany(entities.map(entity => this.adaptId(entity)))

      return entities
    }

    if (!Array.isArray(amountOrEntityOrEntities)) {
      const entity = { ...createDefault(), ...amountOrEntityOrEntities }
      await collection.insertOne(this.adaptId(entity))

      return entity
    }

    const entities = amountOrEntityOrEntities.map(entity => ({ ...createDefault(), ...entity }))
    await collection.insertMany(entities.map(entity => this.adaptId(entity)))

    return entities
  }
}