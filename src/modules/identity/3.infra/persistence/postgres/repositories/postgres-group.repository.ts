import { type DomainError } from '@/common/0.domain/base/domain-error'
import { right, type Either, left } from '@/common/0.domain/utils/either'
import { ServerError } from '@/common/2.presentation/errors/server.error'
import { persistence } from '@/common/4.main/container'

import { type GroupEntity } from '@/identity/0.domain/entities/group.entity'
import { type GroupRepository } from '@/identity/1.application/repositories/group.repository'
import { PostgresGroupMapper } from '@/identity/3.infra/persistence/postgres/mappers/postgres-group.mapper'

type Filter = {
  name?: string
}

export class PostgresGroupRepository implements GroupRepository {
  public static create (): PostgresGroupRepository {
    return new PostgresGroupRepository()
  }

  async create (groupEntity: GroupEntity): Promise<Either<DomainError[], void>> {
    try {
      const repository = await persistence.postgres.client.getRepository('group')
      const group = PostgresGroupMapper.toPersistence(groupEntity)

      await repository.save(group)

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
      const repository = await persistence.postgres.client.getRepository('group')
      const groups = await repository.findBy(filterOrFilters)

      if (!groups.length) {
        return right(null)
      }

      const domainGroups = groups.map(group => PostgresGroupMapper.toDomain(group))

      if (!Array.isArray(filterOrFilters)) {
        return right(domainGroups[0])
      }

      return right(domainGroups)
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }
}
