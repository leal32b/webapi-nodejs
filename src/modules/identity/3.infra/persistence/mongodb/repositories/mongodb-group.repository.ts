import { type DomainError } from '@/common/0.domain/base/domain-error'
import { left, type Either, right } from '@/common/0.domain/utils/either'
import { ServerError } from '@/common/2.presentation/errors/server.error'
import { persistence } from '@/common/4.main/container'

import { type GroupEntity } from '@/identity/0.domain/entities/group.entity'
import { type GroupRepository } from '@/identity/1.application/repositories/group.repository'
import { MongodbGroupMapper } from '@/identity/3.infra/persistence/mongodb/mappers/mongodb-group.mapper'

export class MongodbGroupRepository implements GroupRepository {
  public static create (): MongodbGroupRepository {
    return new MongodbGroupRepository()
  }

  async create (groupEntity: GroupEntity): Promise<Either<DomainError[], void>> {
    try {
      const groupCollection = await persistence.mongodb.client.getCollection('group')
      const group = MongodbGroupMapper.toPersistence(groupEntity)
      await groupCollection.insertOne(group)

      return right()
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  async readByName (name: string): Promise<Either<DomainError[], GroupEntity>> {
    try {
      const group = await this.readByFilter({ name })

      if (!group) {
        return right(null)
      }

      return right(MongodbGroupMapper.toDomain(group))
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  // TODO: adjust
  async readManyByNames (name: string[]): Promise<Either<DomainError[], GroupEntity[]>> {
    try {
      const group = await this.readByFilter({ name })

      if (!group) {
        return right(null)
      }

      return right([MongodbGroupMapper.toDomain(group)])
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  private async readByFilter (filter: Record<string, any>): Promise<any> {
    const userCollection = await persistence.mongodb.client.getCollection('group')

    const user = await userCollection.findOne(filter)

    return user
  }
}
