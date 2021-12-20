import User from '@/0.domain/entities/user'
import { UserData } from '@/0.domain/types/user-types'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import { MongodbAdapter } from '@/3.infra/databases/mongodb/adapter/mongodb'

export default class UserMongodbRepository implements CreateUserRepository {
  async create (userData: UserData): Promise<User> {
    const userCollection = MongodbAdapter.getCollection('users')
    const result = await userCollection.insertOne(userData)
    const user = { _id: result.insertedId.toString(), ...userData }

    return new User(MongodbAdapter.map(user))
  }
}
