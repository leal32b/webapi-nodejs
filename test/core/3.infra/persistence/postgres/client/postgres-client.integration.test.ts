// unit test 2.01s
import { DataSource, EntityManager, Repository } from 'typeorm'

import { PostgresClient } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { persistence } from '@/core/4.main/config'

type SutTypes = {
  sut: PostgresClient
}

const makeSut = async (): Promise<SutTypes> => {
  const sut = persistence.postgres.client

  return { sut }
}

describe('PostgresClient', () => {
  beforeAll(async () => {
    await persistence.postgres.client.connect()
  })

  afterAll(async () => {
    await persistence.postgres.client.close()
  })

  describe('success', () => {
    xit('connects to dataSource', async () => {
      const { sut } = await makeSut()
      await sut.close()

      const result = await sut.connect()

      expect(result.isRight()).toBe(true)
    })

    xit('reconnects when dataSource is down', async () => {
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
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'invalid_host',
        port: 5432,
        username: 'any_username',
        password: 'any_password',
        database: 'any_database'
      })
      const postgresClient = new PostgresClient({ dataSource })

      const result = await postgresClient.connect()

      expect(result.isLeft()).toBe(true)
    })
  })
})
