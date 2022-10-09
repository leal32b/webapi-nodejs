import { DataSource, EntityManager, Repository } from 'typeorm'

import { postgres } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { postgresPersistence } from '@/core/4.main/config/persistence/postgres-persistence'

type SutTypes = {
  sut: typeof postgres.client
}

const makeSut = async (): Promise<SutTypes> => {
  const sut = postgres.client

  return { sut }
}

describe('PostgresClient', () => {
  beforeAll(async () => {
    await postgresPersistence.connect()
  })

  afterAll(async () => {
    await postgresPersistence.close()
  })

  describe('success', () => {
    it('connects to dataSource', async () => {
      const { sut } = await makeSut()
      await sut.close()

      const result = await sut.connect()

      expect(result.isRight()).toBe(true)
    })

    it('returns true when dataSource is initialized', async () => {
      const { sut } = await makeSut()

      const result = sut.isInitialized()

      expect(result).toBe(true)
    })

    it('reconnects when dataSource is down', async () => {
      const { sut } = await makeSut()
      await sut.close()

      const result = await sut.reconnect()

      expect(result.isRight()).toBe(true)
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

    it('returns Right on clearDatabase', async () => {
      const { sut } = await makeSut()

      const result = await sut.clearDatabase()

      expect(result.isRight()).toBe(true)
    })

    it('returns Left on clearDatabase when not in test environment', async () => {
      const { sut } = await makeSut()
      process.env.NODE_ENV = 'any_environment'

      const result = await sut.clearDatabase()
      process.env.NODE_ENV = 'test'

      expect(result.isLeft()).toBe(true)
    })

    it('returns an Error on clearDatabase when not in test environment', async () => {
      const { sut } = await makeSut()
      process.env.NODE_ENV = 'any_environment'

      const result = await sut.clearDatabase()
      process.env.NODE_ENV = 'test'

      expect(result.value).toEqual(new Error('Clear database is allowed only in test environment'))
    })
  })

  describe('failure', () => {
    it('returns Left when close throws', async () => {
      const { sut } = await makeSut()
      await sut.close()

      const result = await sut.close()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when clearDatabase throws', async () => {
      const { sut } = await makeSut()
      await sut.close()

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when connect throws', async () => {
      const { sut } = await makeSut()
      await sut.close()

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
  })
})
