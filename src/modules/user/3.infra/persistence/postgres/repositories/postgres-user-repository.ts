import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'
import { type MessageBroker } from '@/core/1.application/events/message-broker'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { persistence } from '@/core/4.main/container'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { UserCreatedEvent } from '@/user/0.domain/events/user-created-event'
import { userCreatedTopic } from '@/user/1.application/events/topics/user-created-topic'
import { type UserRepository } from '@/user/1.application/repositories/user-repository'

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
      const { email, emailConfirmed, id, locale, name, password, token } = userAggregate
      const repository = await persistence.postgres.client.getRepository('users')

      const postgresUser = repository.create({
        email: email.value,
        emailConfirmed: emailConfirmed.value,
        id: id.value,
        locale: locale.value,
        name: name.value,
        password: password.value,
        token: token.value
      })

      await persistence.postgres.client.manager.save(postgresUser)

      this.props.messageBroker.publishToTopic(userCreatedTopic, ['userCreated', '#'], UserCreatedEvent.create({
        aggregateId: id.value,
        payload: {
          email: email.value,
          locale: locale.value,
          token: token.value
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

      const userAggregateOrError = UserAggregate.create(user)

      return userAggregateOrError.applyOnRight(userAggregate => userAggregate)
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

      const userAggregateOrError = UserAggregate.create(user)

      return userAggregateOrError.applyOnRight(userAggregate => userAggregate)
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  async update (userAggregate: UserAggregate): Promise<Either<DomainError[], any>> {
    try {
      const { email, emailConfirmed, id, locale, name, password, token } = userAggregate
      const repository = await persistence.postgres.client.getRepository('users')

      const postgresUser = repository.create({
        email: email.value,
        emailConfirmed: emailConfirmed.value,
        locale: locale.value,
        name: name.value,
        password: password.value,
        token: token.value
      })

      const result = await persistence.postgres.client.manager.update('users', { id: id.value }, postgresUser)

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
