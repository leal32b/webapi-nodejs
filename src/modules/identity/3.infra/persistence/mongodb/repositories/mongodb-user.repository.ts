import { ObjectId } from 'mongodb'

import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type MessageBroker } from '@/common/1.application/events/message-broker'
import { ServerError } from '@/common/2.presentation/errors/server.error'
import { persistence } from '@/common/4.main/container'

import { type UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { UserCreatedEvent } from '@/identity/0.domain/events/user-created.event'
import { userEventsTopic } from '@/identity/1.application/events/topics/user-events.topic'
import { type UserRepository } from '@/identity/1.application/repositories/user.repository'
import { MongodbUserMapper } from '@/identity/3.infra/persistence/mongodb/mappers/mongodb-user.mapper'

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
      const userCollection = await persistence.mongodb.client.getCollection('user')
      const user = MongodbUserMapper.toPersistence(userAggregate)
      await userCollection.insertOne(user)

      this.props.messageBroker.publishToTopic(userEventsTopic, ['userCreated', '#'], UserCreatedEvent.create({
        aggregateId: user._id.toString(),
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

      return right(MongodbUserMapper.toDomain(user))
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  async readById (id: string): Promise<Either<DomainError[], UserAggregate>> {
    try {
      const user = await this.readByFilter({ _id: new ObjectId(id) })

      if (!user) {
        return right(null)
      }

      return right(MongodbUserMapper.toDomain(user))
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

      return right(MongodbUserMapper.toDomain(user))
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  async update (userAggregate: UserAggregate): Promise<Either<DomainError[], any>> {
    try {
      const userCollection = await persistence.mongodb.client.getCollection('user')
      const user = MongodbUserMapper.toPersistence(userAggregate)

      const result = await userCollection.updateOne({ _id: new ObjectId(user.id) }, {
        $set: user
      })

      return right(result)
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  private async readByFilter (filter: Record<string, any>): Promise<any> {
    const userCollection = await persistence.mongodb.client.getCollection('user')

    const user = await userCollection.findOne(filter)

    return user
  }
}
