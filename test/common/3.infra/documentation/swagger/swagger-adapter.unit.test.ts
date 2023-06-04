import { SwaggerAdapter } from '@/common/3.infra/documentation/swagger/swagger-adapter'

type SutTypes = {
  sut: SwaggerAdapter
}

const makeSut = (): SutTypes => {
  const params = {
    components: {
      securitySchemes: {
        accessToken: {
          bearerFormat: 'any_format',
          scheme: 'any_scheme',
          type: 'any_type'
        }
      }
    },
    info: {
      description: 'any_description',
      title: 'any_title',
      version: 'any_version'
    },
    openapi: 'any_version',
    paths: {},
    schemas: {},
    servers: [{
      description: 'any_description',
      url: 'any_url'
    }],
    tags: []
  }

  const sut = SwaggerAdapter.create(params)

  return {
    ...params,
    sut
  }
}

describe('SwaggerAdapter', () => {
  describe('success', () => {
    it('gets config', () => {
      const { sut } = makeSut()

      const result = sut.config

      expect(result).toEqual({
        components: {
          securitySchemes: {
            accessToken: {
              bearerFormat: 'any_format',
              scheme: 'any_scheme',
              type: 'any_type'
            }
          }
        },
        info: {
          description: 'any_description',
          title: 'any_title',
          version: 'any_version'
        },
        openapi: 'any_version',
        paths: {},
        schemas: {},
        servers: [{
          description: 'any_description',
          url: 'any_url'
        }],
        tags: []
      })
    })
  })
})
