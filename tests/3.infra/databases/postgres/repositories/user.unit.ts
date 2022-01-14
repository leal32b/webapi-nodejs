import { PostgresAdapter } from '@/3.infra/databases/postgres/adapter/postgres'
import UserPostgresRepository from '@/3.infra/databases/postgres/repositories/user'

type SutTypes = {
  sut: UserPostgresRepository
}

const makeSut = (): SutTypes => {
  const sut = new UserPostgresRepository()

  return {
    sut
  }
}

describe('User Mongodb Repository', () => {
  beforeAll(async () => {
    await PostgresAdapter.connect('test')
  })

  beforeEach(async () => { })

  afterAll(async () => {
    await PostgresAdapter.postgresClient.dropDatabase()
    await PostgresAdapter.close()
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
