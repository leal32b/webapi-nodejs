import 'dotenv/config'

import { PostgresAdapter as sut } from '@/3.infra/databases/postgres/adapter/postgres'
import { PgUser } from '@/3.infra/databases/postgres/entities/user'

describe('Postgres Adapter', () => {
  beforeAll(async () => {
    await sut.connect('test')
  })

  afterAll(async () => {
    await sut.close()
  })

  it('should reconnect if Postgres is down', async () => {
    let repository = await sut.getRepository(PgUser)

    expect(repository).toBeTruthy()

    await sut.close()
    repository = await sut.getRepository(PgUser)

    expect(repository).toBeTruthy()
  })
})
