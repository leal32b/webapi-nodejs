import { MongodbAdapter } from '@/3.infra/databases/mongodb/adapter/mongodb'
import UserMongodbRepository from '@/3.infra/databases/mongodb/repositories/user'

type SutTypes = {
  sut: UserMongodbRepository
}

const makeSut = (): SutTypes => {
  const sut = new UserMongodbRepository()

  return {
    sut
  }
}

describe('User Mongodb Repository', () => {
  beforeAll(async () => {
    await MongodbAdapter.connect(global.__MONGO_URI__)
  })

  beforeEach(async () => {
    await MongodbAdapter.getCollection('users').deleteMany({})
  })

  afterAll(async () => {
    await MongodbAdapter.close()
  })

  it('should return an user on success', async () => {
    const { sut } = makeSut()
    const user = await sut.create({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(user).toBeTruthy()
    expect(user.props.id).toBeTruthy()
    expect(user.props.name).toBe('any_name')
    expect(user.props.email).toBe('any_email@mail.com')
    expect(user.props.password).toBe('any_password')
  })
})
