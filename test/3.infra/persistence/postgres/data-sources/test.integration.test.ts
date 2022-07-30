import 'dotenv/config'

import { pg } from '@/3.infra/persistence/postgres/client/pg-client'
import { testDataSource } from '@/3.infra/persistence/postgres/data-sources/test'

type SutTypes = {
  sut: typeof pg.client
}

const makeSut = (): SutTypes => {
  const sut = pg.client

  return { sut }
}

describe('testDataSource', () => {
  beforeAll(async () => {
    await pg.connect(testDataSource)
  })

  afterAll(async () => {
    await pg.client.close()
  })

  describe('success', () => {
    it('connects to test dataSource', async () => {
      const { sut } = makeSut()

      const result = sut.isInitialized()

      expect(result).toBe(true)
    })
  })
})
