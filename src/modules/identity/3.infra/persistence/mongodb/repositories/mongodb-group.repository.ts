import { type DomainError } from '@/common/0.domain/base/domain-error'
import { left, type Either, right } from '@/common/0.domain/utils/either'
import { ServerError } from '@/common/2.presentation/errors/server.error'
import { persistence } from '@/common/4.main/container'

import { type GroupEntity } from '@/identity/0.domain/entities/group.entity'
import { type GroupRepository } from '@/identity/1.application/repositories/group.repository'
import { MongodbGroupMapper } from '@/identity/3.infra/persistence/mongodb/mappers/mongodb-group.mapper'

type Filter = {
  name?: string
}

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
    const groupEntity = await this.read({ name })

    return groupEntity
  }

  async readManyByNames (names: string[]): Promise<Either<DomainError[], GroupEntity[]>> {
    const filters = names.map(name => ({ name }))
    const groupEntities = await this.read(filters)

    return groupEntities
  }

  private async read (filter: Filter): Promise<Either<DomainError[], GroupEntity>>
  private async read (filters: Filter[]): Promise<Either<DomainError[], GroupEntity[]>>
  private async read (filterOrFilters: Filter | Filter[]): Promise<Either<DomainError[], GroupEntity | GroupEntity[]>> {
    try {
      const groupCollection = await persistence.mongodb.client.getCollection('group')
      const filters = !Array.isArray(filterOrFilters) ? [filterOrFilters] : filterOrFilters
      const groups = await groupCollection
        .find({
          name: {
            $in: filters.map(filter => filter.name)
          }
        })
        .toArray()

      if (!groups.length) {
        return right(null)
      }

      const domainGroups = groups.map(group => MongodbGroupMapper.toDomain(group))

      if (!Array.isArray(filterOrFilters)) {
        return right(domainGroups[0])
      }

      return right(domainGroups)
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }
}

