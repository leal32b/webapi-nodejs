import 'dotenv/config'

import { postgres } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { defaultDataSource } from '@/core/3.infra/persistence/postgres/data-sources/default'

type SutTypes = {
  sut: typeof postgres.client
}

const makeSut = (): SutTypes => {
  const sut = postgres.client

  return { sut }
}

describe('defaultDataSource', () => {
  beforeAll(async () => {
    await postgres.connect(defaultDataSource)
  })

  afterAll(async () => {
    await postgres.client.close()
  })

  describe('success', () => {
    it('connects to default dataSource', async () => {
      const { sut } = makeSut()

      const result = sut.isInitialized()

      expect(result).toBe(true)
    })
  })
})
