import request from 'supertest'

import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence.fixture'
import { type WebApp } from '@/common/3.infra/webapp/web-app'
import { app, persistence } from '@/common/4.main/container'
import { setupWebApp } from '@/common/4.main/setup/webapp'

import { type GroupEntityProps } from '@/identity/0.domain/entities/group.entity'

import { identityFixtures } from '~/identity/_fixtures/identity-fixtures'

type SutTypes = {
  groupFixture: PersistenceFixture<GroupEntityProps>
  webApp: WebApp
}

const makeSut = (): SutTypes => {
  const collaborators = {
    groupFixture: identityFixtures.groupFixture,
    webApp: app.webApp
  }
  setupWebApp(app.webApp)

  return { ...collaborators }
}

describe('CreateGroupRoute', () => {
  beforeAll(async () => {
    await persistence.actual.client.connect()
  })

  afterEach(async () => {
    await persistence.postgres.client.clearDatabase()
  })

  describe('success', () => {
    it('returns 200 with an name on success', async () => {
      const { webApp } = makeSut()

      const { body, statusCode } = await request(webApp.app)
        .post('/api/identity/group')
        .send({ name: 'any_name' })

      expect(statusCode).toBe(200)
      expect(body).toEqual({
        message: 'group created successfully',
        name: 'any_name'
      })
    })
  })

  describe('failure', () => {
    it('returns 422 with schema error message when schema is invalid', async () => {
      const { webApp } = makeSut()

      const { body, statusCode } = await request(webApp.app)
        .post('/api/identity/group')
        .send()

      expect(statusCode).toBe(422)
      expect(body).toEqual({
        error: {
          instancePath: '',
          keyword: 'required',
          message: "must have required property 'name'",
          params: { missingProperty: 'name' },
          schemaPath: '#/required'
        }
      })
    })

    it('returns 400 with name already in use error message when name is already in use', async () => {
      const { groupFixture, webApp } = makeSut()
      const name = 'any_name2'
      await groupFixture.createFixture({ name })

      const { body, statusCode } = await request(webApp.app)
        .post('/api/identity/group')
        .send({ name: 'any_name2' })

      expect(statusCode).toBe(400)
      expect(body).toEqual({
        error: {
          field: 'name',
          input: 'any_name2',
          message: 'name already in use'
        }
      })
    })
  })
})
