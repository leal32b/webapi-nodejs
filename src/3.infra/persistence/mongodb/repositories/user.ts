import { ObjectId } from 'mongodb'

import DomainError from '@/0.domain/base/domain-error'
import User from '@/0.domain/entities/user'
import { Either, left, right } from '@/0.domain/utils/either'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import ServerError from '@/2.presentation/errors/server'
import { MongodbAdapter } from '@/3.infra/persistence/mongodb/adapter/mongodb'

export default class UserMongodbRepository implements CreateUserRepository {
  async create (user: User): Promise<Either<DomainError, User>> {
    try {
      const _id = new ObjectId(user.props.id.value)
      const userToInsert = { ...user.getValue(), _id }
      const userCollection = MongodbAdapter.getCollection('users')

      await userCollection.insertOne(userToInsert)

      return right(user)
    } catch (error) {
      return left(new ServerError(error.message, error.stack))
    }
  }
}
