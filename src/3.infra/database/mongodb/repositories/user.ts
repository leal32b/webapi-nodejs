import { CreateUserModel } from '@/0.domain/interfaces/create-user'
import { UserModel } from '@/0.domain/models/user'
import { CreateUserRepository } from '@/1.application/interfaces/create-user-repository'
import { MongodbAdapter } from '@/3.infra/database/mongodb/adapter/mongodb'

export class UserMongodbRepository implements CreateUserRepository {
  async create (userData: CreateUserModel): Promise<UserModel> {
    const userCollection = MongodbAdapter.getCollection('users')
    const result = await userCollection.insertOne(userData)
    const user = { _id: result.insertedId.toString(), ...userData }

    return MongodbAdapter.map(user)
  }
}
