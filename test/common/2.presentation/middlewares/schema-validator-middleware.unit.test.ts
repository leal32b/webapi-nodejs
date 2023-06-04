import { type ErrorObject } from 'ajv'

import { type Either, left, right } from '@/common/0.domain/utils/either'
import { SchemaValidatorMiddleware } from '@/common/2.presentation/middlewares/schema-validator-middleware'
import { type SchemaValidator, type SchemaValidatorResult } from '@/common/2.presentation/validation/schema-validator'

const makeErrorFake = (): ErrorObject => ({
  properties: {
    anyKey: { type: 'string' }
  },
  required: ['anyKey'],
  type: 'object'
} as any)

const makeSchemaValidatorStub = (): SchemaValidator => ({
  validate: vi.fn(async (): Promise<Either<ErrorObject, SchemaValidatorResult>> => {
    return right({ isValid: true })
  })
})

type SutTypes = {
  errorFake: ErrorObject
  schemaValidator: SchemaValidator
  sut: SchemaValidatorMiddleware
}

const makeSut = (): SutTypes => {
  const props = {
    errorFake: makeErrorFake(),
    role: 'any_role',
    schemaValidator: makeSchemaValidatorStub()
  }

  const sut = SchemaValidatorMiddleware.create(props)

  return {
    ...props,
    sut
  }
}

describe('SchemaValidatorMiddleware', () => {
  describe('success', () => {
    it('returns payload and statusCode 200 when schema is valid', async () => {
      const { sut } = makeSut()
      const schema = {
        additionalProperties: false,
        properties: {
          anyKey: { type: 'string' }
        },
        required: ['anyKey'],
        type: 'object'
      }
      const fakeRequest = {
        payload: { anyKey: 'any_value' },
        schema
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
      vi.spyOn(schemaValidator, 'validate').mockResolvedValueOnce(left(errorFake))
      const fakeRequest = {
        payload: { anyKey: 'any_value' },
        schema: {}
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: {
          error: {
            message: 'internal server error'
          }
        },
        statusCode: 500
      })
    })

    it('returns error and statusCode 422 when schema is invalid', async () => {
      const { sut, schemaValidator, errorFake } = makeSut()
      vi.spyOn(schemaValidator, 'validate').mockResolvedValueOnce(right({
        errors: [errorFake],
        isValid: false
      }))
      const fakeRequest = {
        payload: { anyKey: 'any_value' },
        schema: {}
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: {
          error: {
            properties: { anyKey: { type: 'string' } },
            required: ['anyKey'],
            type: 'object'
          }
        },
        statusCode: 422
      })
    })
  })
})
