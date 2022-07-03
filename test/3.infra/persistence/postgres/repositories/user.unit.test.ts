import User from '@/0.domain/entities/user/user'
import { PostgresAdapter } from '@/3.infra/persistence/postgres/adapter/postgres'
import UserPostgresRepository from '@/3.infra/persistence/postgres/repositories/user'

type SutTypes = {
  sut: UserPostgresRepository
}

const makeSut = (): SutTypes => {
  const sut = new UserPostgresRepository()

  return { sut }
}

describe('UserMongodbRepository', () => {
  beforeAll(async () => {
    await PostgresAdapter.connect('test')
  })

  beforeEach(async () => { })

  afterAll(async () => {
    await PostgresAdapter.postgresClient.dropDatabase()
    await PostgresAdapter.close()
  })

  describe('success', () => {
    it('returns an user on success', async () => {
      const { sut } = makeSut()
      const user = User.create({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        id: 'any_id'
      })

      const result = await sut.create(user.value as User)

      expect(result.value).toBeInstanceOf(User)
    })
  })
})
