import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type MessageBroker } from '@/common/1.application/events/message-broker'
import { ServerError } from '@/common/2.presentation/errors/server.error'
import { persistence } from '@/common/4.main/container'

import { type UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { UserCreatedEvent } from '@/identity/0.domain/events/user-created.event'
import { userCreatedTopic } from '@/identity/1.application/events/topics/user-created.topic'
import { type UserRepository } from '@/identity/1.application/repositories/user.repository'
import { PostgresUserMapper } from '@/identity/3.infra/persistence/postgres/mappers/user.mapper'

type Props = {
  messageBroker: MessageBroker
}

export class PostgresUserRepository implements UserRepository {
  private constructor (private readonly props: Props) {}

  public static create (props: Props): PostgresUserRepository {
    return new PostgresUserRepository(props)
  }

  async create (userAggregate: UserAggregate): Promise<Either<DomainError[], void>> {
    try {
      const repository = await persistence.postgres.client.getRepository('users')
      const user = PostgresUserMapper.toPersistence(userAggregate)
      await persistence.postgres.client.manager.save(repository.create(user))

      this.props.messageBroker.publishToTopic(userCreatedTopic, ['userCreated', '#'], UserCreatedEvent.create({
        aggregateId: user.id,
        payload: {
          email: user.email,
          locale: user.locale,
          token: user.token
        }
      }))

      return right()
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  async readByEmail (email: string): Promise<Either<DomainError[], UserAggregate>> {
    try {
      const user = await this.readByFilter({ email })

      if (!user) {
        return right(null)
      }

      return right(PostgresUserMapper.toDomain(user))
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  async readById (id: string): Promise<Either<DomainError[], UserAggregate>> {
    try {
      const user = await this.readByFilter({ id })

      if (!user) {
        return right(null)
      }

      return right(PostgresUserMapper.toDomain(user))
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  async readByToken (token: string): Promise<Either<DomainError[], UserAggregate>> {
    try {
      const user = await this.readByFilter({ token })

      if (!user) {
        return right(null)
      }

      return right(PostgresUserMapper.toDomain(user))
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  async update (userAggregate: UserAggregate): Promise<Either<DomainError[], any>> {
    try {
      const repository = await persistence.postgres.client.getRepository('users')
      const user = PostgresUserMapper.toPersistence(userAggregate)
      const result = await persistence.postgres.client.manager.update('users', { id: user.id }, repository.create(user))

      return right(result)
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  private async readByFilter (filter: Record<string, any>): Promise<any> {
    const repository = await persistence.postgres.client.getRepository('users')

    const user = await repository.findOneBy(filter)

    return user
  }
}
