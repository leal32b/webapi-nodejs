import 'dotenv/config'

import { DataSource, EntityManager, Repository } from 'typeorm'

import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'
import { PgUser } from '@/user/3.infra/persistence/postgres/entities/pg-user'

const makeManagerStub = (): EntityManager => {
  return new EntityManager(new DataSource({ type: 'postgres' }))
}

const makeDataSourceMock = (): DataSource => ({
  initialize: jest.fn(async (): Promise<void> => {}),
  isInitialized: true,
  destroy: jest.fn(async (): Promise<void> => {}),
  manager: makeManagerStub(),
  getRepository: jest.fn((): Repository<PgUser> => {
    return new Repository(PgUser, makeManagerStub())
  })
}) as any

type SutTypes = {
  sut: typeof pg.client
  dataSourceMock: DataSource
}

const makeSut = (): SutTypes => {
  const fakes = {
    dataSourceMock: makeDataSourceMock()
  }
  pg.connect(fakes.dataSourceMock)
  const sut = pg.client

  return { sut, ...fakes }
}

describe('PgClient', () => {
  describe('success', () => {
    it('returns true when dataSource is initialized', async () => {
      const { sut } = makeSut()

      const result = sut.isInitialized()

      expect(result).toBe(true)
    })

    it('reconnects when dataSource is down', async () => {
      const { sut, dataSourceMock } = makeSut()

      await sut.reconnect()

      expect(dataSourceMock.initialize).toBeCalled()
    })

    it('gets dataSource manager', async () => {
      const { sut } = makeSut()

      const result = sut.manager

      expect(result).toBeInstanceOf(EntityManager)
    })

    it('gets a repository', async () => {
      const { sut } = makeSut()

      const result = await sut.getRepository('PgUser')

      expect(result).toBeInstanceOf(Repository)
    })
  })

  describe('failure', () => {
    it('returns Left if connect throws', async () => {
      const { dataSourceMock } = makeSut()
      jest.spyOn(dataSourceMock, 'initialize').mockRejectedValueOnce(new Error())

      const result = await pg.connect(new DataSource({
        type: 'postgres',
        host: 'invalid_host',
        port: 5432,
        username: 'any_username',
        password: 'any_password',
        database: 'any_database'
      }))

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left if connect throws', async () => {
      const { sut, dataSourceMock } = makeSut()
      jest.spyOn(dataSourceMock, 'destroy').mockRejectedValueOnce(new Error())

      const result = await sut.close()

      expect(result.isLeft()).toBe(true)
    })
  })
})
