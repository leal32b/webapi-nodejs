import { DataSource, EntityManager, Repository } from 'typeorm'

import { postgres } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { PostgresUser } from '@/user/3.infra/persistence/postgres/entities/postgres-user'

const makeManagerStub = (): EntityManager => {
  return new EntityManager(new DataSource({ type: 'postgres' }))
}

const makeDataSourceMock = (): DataSource => ({
  initialize: jest.fn(async (): Promise<void> => {}),
  isInitialized: true,
  destroy: jest.fn(async (): Promise<void> => {}),
  manager: makeManagerStub(),
  getRepository: jest.fn((): Repository<PostgresUser> => new Repository(PostgresUser, makeManagerStub()))
}) as any

type SutTypes = {
  sut: typeof postgres.client
  dataSourceMock: DataSource
}

const makeSut = async (): Promise<SutTypes> => {
  const dataSourceMock = makeDataSourceMock()
  await postgres.connect(dataSourceMock)
  const sut = postgres.client

  return { sut, dataSourceMock }
}

describe('PostgresClient', () => {
  afterAll(async () => {
    await postgres.client.close()
  })

  describe('success', () => {
    it('returns true when dataSource is initialized', async () => {
      const { sut } = await makeSut()

      const result = sut.isInitialized()

      expect(result).toBe(true)
    })

    it('reconnects when dataSource is down', async () => {
      const { sut, dataSourceMock } = await makeSut()

      await sut.reconnect()

      expect(dataSourceMock.initialize).toBeCalled()
    })

    it('gets dataSource manager', async () => {
      const { sut } = await makeSut()

      const result = sut.manager

      expect(result).toBeInstanceOf(EntityManager)
    })

    it('gets a repository', async () => {
      const { sut } = await makeSut()

      const result = await sut.getRepository('PostgresUser')

      expect(result).toBeInstanceOf(Repository)
    })

    xit('returns Right on clearDatabase', async () => {
      const { sut } = await makeSut()

      const result = await sut.clearDatabase()
      console.log('result >>>', result)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when connect throws', async () => {
      const { dataSourceMock } = await makeSut()
      jest.spyOn(dataSourceMock, 'initialize').mockRejectedValueOnce(new Error())

      const result = await postgres.connect(new DataSource({
        type: 'postgres',
        host: 'invalid_host',
        port: 5432,
        username: 'any_username',
        password: 'any_password',
        database: 'any_database'
      }))

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when close throws', async () => {
      const { sut, dataSourceMock } = await makeSut()
      jest.spyOn(dataSourceMock, 'destroy').mockRejectedValueOnce(new Error())

      const result = await sut.close()

      expect(result.isLeft()).toBe(true)
    })
  })
})
