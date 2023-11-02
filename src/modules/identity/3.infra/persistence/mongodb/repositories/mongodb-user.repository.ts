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
import { MongodbUserModel } from '@/identity/3.infra/persistence/mongodb/entities/mongodb-user.entity'
import { MongodbGroupMapper } from '@/identity/3.infra/persistence/mongodb/mappers/mongodb-group.mapper'
import { MongodbUserMapper } from '@/identity/3.infra/persistence/mongodb/mappers/mongodb-user.mapper'

type Filter = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _id?: ObjectId
  email?: string
  token?: string
}

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
      await userCollection.insertOne(new MongodbUserModel(user))

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
    const userAggregate = await this.read({ email })

    return userAggregate
  }

  async readById (id: string): Promise<Either<DomainError[], UserAggregate>> {
    const userAggregate = await this.read({ _id: new ObjectId(id) })

    return userAggregate
  }

  async readByToken (token: string): Promise<Either<DomainError[], UserAggregate>> {
    const userAggregate = await this.read({ token })

    return userAggregate
  }

  async update (userAggregate: UserAggregate): Promise<Either<DomainError[], void>> {
    try {
      const userCollection = await persistence.mongodb.client.getCollection('user')
      const user = MongodbUserMapper.toPersistence(userAggregate)
      const groups = userAggregate.groups.map(group => new ObjectId(group.id))

      await userCollection.updateOne({
        _id: user._id
      }, {
        $set: {
          ...user,
          groups
        }
      })

      return right()
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }

  private async read (filter: Filter): Promise<Either<DomainError[], UserAggregate>> {
    try {
      const userCollection = await persistence.mongodb.client.getCollection('user')
      const groupCollection = await persistence.mongodb.client.getCollection('group')
      const user = await userCollection.findOne(filter)

      if (!user) {
        return right(null)
      }

      const domainUser = MongodbUserMapper.toDomain(user)
      const userGroupIds = user.groups?.map(group => new ObjectId(group))
      const userGroups = await groupCollection
        .find({
          _id: {
            $in: userGroupIds
          }
        })
        .toArray()

      if (userGroups.length) {
        domainUser.setGroups(userGroups.map(userGroup => MongodbGroupMapper.toDomain(userGroup)))
      }

      return right(domainUser)
    } catch (error) {
      return left([ServerError.create(error.message, error.stack)])
    }
  }
}
