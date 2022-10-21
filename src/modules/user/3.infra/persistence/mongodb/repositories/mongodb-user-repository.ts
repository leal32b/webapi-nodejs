import { ObjectId } from 'mongodb'

import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { persistence } from '@/core/4.main/container'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { UserRepository } from '@/user/1.application/repositories/user-repository'

export class MongodbUserRepository implements UserRepository {
  async create (userAggregate: UserAggregate): Promise<Either<DomainError[], void>> {
    try {
      const { email, emailConfirmed, id, name, password, token } = userAggregate
      const userCollection = await persistence.mongodb.client.getCollection('users')

      const _id = new ObjectId(id.value)
      await userCollection.insertOne({
        _id,
        email: email.value,
        emailConfirmed: emailConfirmed.value,
        name: name.value,
        password: password.value,
        token: token.value
      })

      return right()
    } catch (error) {
      return left([new ServerError(error.message, error.stack)])
    }
  }

  async readByEmail (email: string): Promise<Either<DomainError[], UserAggregate>> {
    try {
      const user = await this.readByFilter({ email })

      if (!user) {
        return right(null)
      }

      const userAggregateOrError = UserAggregate.create({
        id: user._id.toString(),
        email: user.email,
        emailConfirmed: user.emailConfirmed,
        name: user.name,
        password: user.password,
        token: user.token
      })

      return userAggregateOrError.applyOnRight(userAggregate => userAggregate)
    } catch (error) {
      return left([new ServerError(error.message, error.stack)])
    }
  }

  async readById (id: string): Promise<Either<DomainError[], UserAggregate>> {
    try {
      const user = await this.readByFilter({ _id: id })

      if (!user) {
        return right(null)
      }

      const userAggregateOrError = UserAggregate.create({
        id: user._id.toString(),
        email: user.email,
        emailConfirmed: user.emailConfirmed,
        name: user.name,
        password: user.password,
        token: user.token
      })

      return userAggregateOrError.applyOnRight(userAggregate => userAggregate)
    } catch (error) {
      return left([new ServerError(error.message, error.stack)])
    }
  }

  async update (userAggregate: UserAggregate): Promise<Either<DomainError[], any>> {
    try {
      const { email, emailConfirmed, id, name, password, token } = userAggregate
      const userCollection = await persistence.mongodb.client.getCollection('users')

      const result = await userCollection.updateOne({ _id: id }, {
        $set: {
          email: email.value,
          emailConfirmed: emailConfirmed.value,
          name: name.value,
          password: password.value,
          token: token.value
        }
      })

      return right(result)
    } catch (error) {
      return left([new ServerError(error.message, error.stack)])
    }
  }

  private async readByFilter (filter: { [key: string]: any }): Promise<any> {
    const userCollection = await persistence.mongodb.client.getCollection('users')

    const user = await userCollection.findOne(filter)

    return user
  }
}
