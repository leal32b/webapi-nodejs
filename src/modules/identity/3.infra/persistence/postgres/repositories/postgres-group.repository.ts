import { type DomainError } from '@/common/0.domain/base/domain-error'
import { right, type Either, left } from '@/common/0.domain/utils/either'
import { ServerError } from '@/common/2.presentation/errors/server.error'
import { persistence } from '@/common/4.main/container'

import { type GroupEntity } from '@/identity/0.domain/entities/group.entity'
import { type GroupRepository } from '@/identity/1.application/repositories/group.repository'
import { PostgresGroupMapper } from '@/identity/3.infra/persistence/postgres/mappers/postgres-group.mapper'

export class PostgresGroupRepository implements GroupRepository {
  public static create (): PostgresGroupRepository {
    return new PostgresGroupRepository()
  }

  async create (groupEntity: GroupEntity): Promise<Either<DomainError[], void>> {
    try {
      const repository = await persistence.postgres.client.getRepository('group')
      const group = PostgresGroupMapper.toPersistence(groupEntity)
      await persistence.postgres.client.manager.save(repository.create(group))

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

      return right(PostgresGroupMapper.toDomain(group))
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  private async readByFilter (filter: Record<string, any>): Promise<any> {
    const repository = await persistence.postgres.client.getRepository('group')

    const user = await repository.findOneBy(filter)

    return user
  }
}
