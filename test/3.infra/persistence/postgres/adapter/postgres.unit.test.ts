import 'dotenv/config'

import { PostgresAdapter } from '@/3.infra/persistence/postgres/adapter/postgres'
import { PgUser } from '@/3.infra/persistence/postgres/entities/user'

type SutTypes = {
  sut: typeof PostgresAdapter
}

const makeSut = (): SutTypes => {
  const sut = PostgresAdapter

  return { sut }
}

describe('PostgresAdapter', () => {
  const { sut } = makeSut()

  beforeAll(async () => {
    await sut.connect('test')
  })

  afterAll(async () => {
    await sut.close()
  })

  describe('success', () => {
    it('reconnects when Postgres is down', async () => {
      let repository = await sut.getRepository(PgUser)

      expect(repository).toBeTruthy()

      await sut.close()
      repository = await sut.getRepository(PgUser)

      expect(repository).toBeTruthy()
    })
  })
})
