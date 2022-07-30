import 'dotenv/config'

import { pg } from '@/3.infra/persistence/postgres/client/pg-client'
import { defaultDataSource } from '@/3.infra/persistence/postgres/data-sources/default'

type SutTypes = {
  sut: typeof pg.client
}

const makeSut = (): SutTypes => {
  const sut = pg.client

  return { sut }
}

describe('defaultDataSource', () => {
  beforeAll(async () => {
    await pg.connect(defaultDataSource)
  })

  afterAll(async () => {
    await pg.client.close()
  })

  describe('success', () => {
    it('connects to default dataSource', async () => {
      const { sut } = makeSut()

      const result = sut.isInitialized()

      expect(result).toBe(true)
    })
  })
})
