import 'dotenv/config'

import { DataSource, EntityManager, Repository } from 'typeorm'

import { pg } from '@/3.infra/persistence/postgres/client/pg-client'
import { testDataSource } from '@/3.infra/persistence/postgres/data-sources/test'

type SutTypes = {
  sut: typeof pg.client
}

const makeSut = (): SutTypes => {
  const sut = pg.client

  return { sut }
}

describe('PgClient', () => {
  beforeAll(async () => {
    await pg.connect(testDataSource)
  })

  afterAll(async () => {
    await pg.client.close()
  })

  describe('success', () => {
    it('returns true when dataSource is initialized', async () => {
      const { sut } = makeSut()

      const result = sut.isInitialized()

      expect(result).toBe(true)
    })

    it('returns false when dataSource is not initialized', async () => {
      const { sut } = makeSut()
      await sut.close()

      const result = sut.isInitialized()

      expect(result).toBe(false)
    })

    it('reconnects when dataSource is down', async () => {
      const { sut } = makeSut()
      await sut.close()

      await sut.reconnect()
      const result = sut.isInitialized()

      expect(result).toBe(true)
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
      const { sut } = makeSut()
      await sut.close()

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
  })
})
