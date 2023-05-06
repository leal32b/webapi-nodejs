import { ObjectId } from 'mongodb'

import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type MessageBroker } from '@/common/1.application/events/message-broker'
import { ServerError } from '@/common/2.presentation/errors/server-error'
import { persistence } from '@/common/4.main/container'

import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { UserCreatedEvent } from '@/user/0.domain/events/user-created-event'
import { userCreatedTopic } from '@/user/1.application/events/topics/user-created-topic'
import { type UserRepository } from '@/user/1.application/repositories/user-repository'

type Props = {
  messageBroker: MessageBroker
}

export class MongodbUserRepository implements UserRepository {
  private constructor (private readonly props: Props) {}

  public static create (props: Props): MongodbUserRepository {
    return new MongodbUserRepository(props)
  }

  async create (userAggregate: UserAggregate): Promise<Either<DomainError[], void>> {
    try {
      const { email, emailConfirmed, id, locale, name, password, token } = userAggregate
      const userCollection = await persistence.mongodb.client.getCollection('users')

      const _id = new ObjectId(id.value)
      await userCollection.insertOne({
        _id,
        email: email.value,
        emailConfirmed: emailConfirmed.value,
        locale: locale.value,
        name: name.value,
        password: password.value,
        token: token.value
      })

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

      const userAggregateOrError = UserAggregate.create({
        email: user.email,
        emailConfirmed: user.emailConfirmed,
        id: user._id.toString(),
        locale: user.locale,
        name: user.name,
        password: user.password,
        token: user.token
      })

      return userAggregateOrError.applyOnRight(userAggregate => userAggregate)
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  async readById (id: string): Promise<Either<DomainError[], UserAggregate>> {
    try {
      const user = await this.readByFilter({ _id: id })

      if (!user) {
        return right(null)
      }

      const userAggregateOrError = UserAggregate.create({
        email: user.email,
        emailConfirmed: user.emailConfirmed,
        id: user._id.toString(),
        locale: user.locale,
        name: user.name,
        password: user.password,
        token: user.token
      })

      return userAggregateOrError.applyOnRight(userAggregate => userAggregate)
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  async update (userAggregate: UserAggregate): Promise<Either<DomainError[], any>> {
    try {
      const { email, emailConfirmed, id, locale, name, password, token } = userAggregate
      const userCollection = await persistence.mongodb.client.getCollection('users')

      const result = await userCollection.updateOne({ _id: id }, {
        $set: {
          email: email.value,
          emailConfirmed: emailConfirmed.value,
          locale: locale.value,
          name: name.value,
          password: password.value,
          token: token.value
        }
      })

      return right(result)
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  private async readByFilter (filter: Record<string, any>): Promise<any> {
    const userCollection = await persistence.mongodb.client.getCollection('users')

    const user = await userCollection.findOne(filter)

    return user
  }
}
