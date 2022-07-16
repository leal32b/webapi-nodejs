import 'dotenv/config'

import { EntityManager, Repository } from 'typeorm'

import pg from '@/3.infra/persistence/postgres/client/pg-client'
import { testDataSource } from '@/3.infra/persistence/postgres/data-sources/test'

type SutTypes = {
  sut: typeof pg.client
}

const makeSut = (): SutTypes => {
  return { sut: pg.client }
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

    xit('returns false when dataSource is not initialized', async () => {
      const { sut } = makeSut()
      await sut.close()

      const result = sut.isInitialized()

      expect(result).toBe(false)
    })

    xit('reconnects when dataSource is down', async () => {
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
})
