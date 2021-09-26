import { MongodbHelper } from '@/3.infra/database/mongodb/helpers/mongodb'
import { AccountMongodbRepository } from '@/3.infra/database/mongodb/repositories/account'

interface SutTypes {
  sut: AccountMongodbRepository
}

const makeSut = (): SutTypes => {
  const sut = new AccountMongodbRepository()

  return {
    sut
  }
}

describe('Account Mongodb Repository', () => {
  beforeAll(async () => {
    await MongodbHelper.connect(global.__MONGO_URI__)
  })

  beforeEach(async () => {
    await MongodbHelper.getCollection('accounts').deleteMany({})
  })

  afterAll(async () => {
    await MongodbHelper.close()
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
})
