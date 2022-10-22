import { IntegerGreaterThanZero } from '@/core/0.domain/types/integer-greater-than-zero'
import { DatabaseFixture } from '@/core/3.infra/persistence/database-fixture'
import { persistence } from '@/core/4.main/container'

type Props<T> = {
  createDefault: () => T
  collectionName: string
}

export abstract class MongodbFixture<T> implements DatabaseFixture<T> {
  protected constructor (private readonly props: Props<T>) {}

  private async create (): Promise<T>
  private async create (entity: Partial<T>): Promise<T>
  private async create (entities: Array<Partial<T>>): Promise<T[]>
  private async create <N extends number>(amount: IntegerGreaterThanZero<N>): Promise<T[]>
  private async create <N extends number>(amountOrEntityOrEntities?: IntegerGreaterThanZero<N> | Partial<T> | Array<Partial<T>>): Promise<T | T[]> {
    const { createDefault, collectionName } = this.props
    const collection = await persistence.mongodb.client.getCollection(collectionName)

    if (typeof amountOrEntityOrEntities === 'number') {
      const entities: T[] = []

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

  private adaptId (entity: any): T {
    const { id, ...entityWithoutId } = entity

    return { ...entityWithoutId, _id: id }
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
