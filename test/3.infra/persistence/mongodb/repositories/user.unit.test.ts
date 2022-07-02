import User from '@/0.domain/entities/user'
import { MongodbAdapter } from '@/3.infra/persistence/mongodb/adapter/mongodb'
import UserMongodbRepository from '@/3.infra/persistence/mongodb/repositories/user'

type SutTypes = {
  sut: UserMongodbRepository
}

const makeSut = (): SutTypes => {
  const sut = new UserMongodbRepository()

  return { sut }
}

describe('UserMongodbRepository', () => {
  beforeAll(async () => {
    await MongodbAdapter.connect(global.__MONGO_URI__)
  })

  beforeEach(async () => {
    await MongodbAdapter.getCollection('users').deleteMany({})
  })

  afterAll(async () => {
    await MongodbAdapter.close()
  })

  describe('success', () => {
    it('returns an user on success', async () => {
      const { sut } = makeSut()
      const user = User.create({
        email: 'any@mail.com',
        name: 'any_name',
        password: 'any_password',
        id: 'any_id______'
      })

      const result = await sut.create(user.value as User)

      expect(result.value).toBeInstanceOf(User)
    })
  })
})
