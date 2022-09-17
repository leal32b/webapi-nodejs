import { Either, left, right } from '@/core/0.domain/utils/either'
import { SchemaValidatorMiddleware } from '@/core/3.infra/api/middlewares/schema-validator-middleware'
import { SchemaValidator, SchemaValidatorResult } from '@/core/3.infra/api/validators/schema-validator'

const makeErrorFake = (): Error => {
  return new Error('any_message')
}

const makeSchemaValidatorStub = (): SchemaValidator => ({
  validate: jest.fn(async (): Promise<Either<Error, SchemaValidatorResult>> => {
    return right({ isValid: true })
  })
})

type SutTypes = {
  sut: SchemaValidatorMiddleware
  schemaValidator: SchemaValidator
  errorFake: Error
}

const makeSut = (): SutTypes => {
  const params = {
    schemaValidator: makeSchemaValidatorStub(),
    role: 'any_role',
    errorFake: makeErrorFake()
  }

  const sut = new SchemaValidatorMiddleware(params)

  return { sut, ...params }
}

describe('SchemaValidatorMiddleware', () => {
  describe('success', () => {
    it('returns payload and statusCode 200 when schema is valid', async () => {
      const { sut } = makeSut()
      const schema = {
        type: 'object',
        properties: {
          anyKey: { type: 'string' }
        },
        required: ['anyKey'],
        additionalProperties: false
      }
      const fakeRequest = {
        schema,
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: { anyKey: 'any_value' },
        statusCode: 200
      })
    })
  })

  describe('failure', () => {
    it('returns error and statusCode 500 when schemaValidator.validate fails', async () => {
      const { sut, schemaValidator, errorFake } = makeSut()
      jest.spyOn(schemaValidator, 'validate').mockResolvedValueOnce(left(errorFake))
      const fakeRequest = {
        schema: 'any_schema',
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: {
          props: {
            message: 'any_message',
            stack: expect.any(String)
          }
        },
        statusCode: 500
      })
    })

    it('returns error and statusCode 422 when schema is invalid', async () => {
      const { sut, schemaValidator, errorFake } = makeSut()
      jest.spyOn(schemaValidator, 'validate').mockResolvedValueOnce(right({
        isValid: false,
        errors: [errorFake]
      }))
      const fakeRequest = {
        schema: 'invalid_schema',
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: [errorFake],
        statusCode: 422
      })
    })
  })
})
