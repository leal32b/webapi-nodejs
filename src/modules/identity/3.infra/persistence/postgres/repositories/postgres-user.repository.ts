import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type MessageBroker } from '@/common/1.application/events/message-broker'
import { ServerError } from '@/common/2.presentation/errors/server.error'
import { persistence } from '@/common/4.main/container'

import { type UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { UserCreatedEvent } from '@/identity/0.domain/events/user-created.event'
import { userEventsTopic } from '@/identity/1.application/events/topics/user-events.topic'
import { type UserRepository } from '@/identity/1.application/repositories/user.repository'
import { PostgresGroupMapper } from '@/identity/3.infra/persistence/postgres/mappers/postgres-group.mapper'
import { PostgresUserMapper } from '@/identity/3.infra/persistence/postgres/mappers/postgres-user.mapper'

type Filter = {
  email?: string
  id?: string
  token?: string
}

type Props = {
  messageBroker: MessageBroker
}

export class PostgresUserRepository implements UserRepository {
  private constructor (private readonly props: Props) {}

  public static create (props: Props): PostgresUserRepository {
    return new PostgresUserRepository(props)
  }

  public async create (userAggregate: UserAggregate): Promise<Either<DomainError[], void>> {
    try {
      const userRepository = await persistence.postgres.client.getRepository('user')
      const user = PostgresUserMapper.toPersistence(userAggregate)

      await userRepository.save(user)
      await this.updateUserGroups(userAggregate)

      this.props.messageBroker.publishToTopic(userEventsTopic, ['userCreated', '#'], UserCreatedEvent.create({
        aggregateId: user.id,
        payload: {
          email: user.email,
          id: user.id,
          locale: user.locale,
          token: user.token
        }
      }))

      return right()
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  public async readByEmail (email: string): Promise<Either<DomainError[], UserAggregate>> {
    const userAggregate = await this.read({ email })

    return userAggregate
  }

  public async readById (id: string): Promise<Either<DomainError[], UserAggregate>> {
    const userAggregate = await this.read({ id })

    return userAggregate
  }

  public async readByToken (token: string): Promise<Either<DomainError[], UserAggregate>> {
    const userAggregate = await this.read({ token })

    return userAggregate
  }

  public async update (userAggregate: UserAggregate): Promise<Either<DomainError[], void>> {
    try {
      const userRepository = await persistence.postgres.client.getRepository('user')
      const user = PostgresUserMapper.toPersistence(userAggregate)

      await userRepository.update({ id: user.id }, user)
      await this.updateUserGroups(userAggregate)

      return right()
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  private async read (filter: Filter): Promise<Either<DomainError[], UserAggregate>> {
    try {
      const userRepository = await persistence.postgres.client.getRepository('user')
      const userGroupRepository = await persistence.postgres.client.getRepository('user_group')
      const user = await userRepository.findOneBy(filter)

      if (!user) {
        return right(null)
      }

      const domainUser = PostgresUserMapper.toDomain(user)
      const userGroups = await userGroupRepository.find({
        relations: ['group'],
        where: {
          userId: user.id
        }
      })

      if (userGroups.length) {
        domainUser.setGroups(userGroups.map(userGroup => PostgresGroupMapper.toDomain(userGroup.group)))
      }

      return right(domainUser)
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  private async updateUserGroups (userAggregate: UserAggregate): Promise<void> {
    const userGroupRepository = await persistence.postgres.client.getRepository('user_group')
    const userGroups = await userGroupRepository.find({
      relations: ['group'],
      where: {
        userId: userAggregate.aggregateRoot.id
      }
    })
    const domainUserGroups = userGroups.map(userGroup => PostgresGroupMapper.toDomain(userGroup.group))
    const groupsToInsert = userAggregate.groups.filter(item => !domainUserGroups.includes(item))
    const groupsToDelete = domainUserGroups.filter(item => !userAggregate.groups.includes(item))

    await userGroupRepository.save(groupsToInsert.map(userGroup => ({
      groupId: userGroup.props.id,
      userId: userAggregate.aggregateRoot.id
    })))

    if (!groupsToDelete.length) {
      return
    }

    await userGroupRepository.delete(groupsToDelete.map(userGroup => ({
      groupId: userGroup.props.id
    })))
  }
}
