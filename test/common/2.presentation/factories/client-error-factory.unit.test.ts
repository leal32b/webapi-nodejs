import { type DomainError } from '@/common/0.domain/base/domain-error'
import { clientError } from '@/common/2.presentation/factories/client-error-factory'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'

const makeSchemaErrorFake = (): any => ({
  properties: {
    anyKey: { type: 'string' }
  },
  required: ['anyKey'],
  type: 'object'
})

type SutTypes = {
  errorFake: DomainError
  schemaErrorFake: any
  sut: typeof clientError
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    schemaErrorFake: makeSchemaErrorFake()
  }
  const sut = clientError

  return {
    ...doubles,
    sut
  }
}

describe('clientError', () => {
  describe('success', () => {
    describe('badRequest', () => {
      it('returns AppResponse with correct badRequest status and error', () => {
        const { sut, errorFake } = makeSut()

        const result = sut.badRequest([errorFake])

        expect(result).toEqual({
          payload: {
            error: {
              message: 'any_message'
            }
          },
          statusCode: 400
        })
      })

      it('returns AppResponse with correct badRequest status and errors', () => {
        const { sut, errorFake } = makeSut()

        const result = sut.badRequest([errorFake, errorFake])

        expect(result).toEqual({
          payload: {
            errors: [
              { message: 'any_message' },
              { message: 'any_message' }
            ]
          },
          statusCode: 400
        })
      })
    })

    describe('unauthorized', () => {
      it('returns AppResponse with correct unauthorized status and error', () => {
        const { sut, errorFake } = makeSut()

        const result = sut.unauthorized([errorFake])

        expect(result).toEqual({
          payload: {
            error: {
              message: 'any_message'
            }
          },
          statusCode: 401
        })
      })

      it('returns AppResponse with correct unauthorized status and errors', () => {
        const { sut, errorFake } = makeSut()

        const result = sut.unauthorized([errorFake, errorFake])

        expect(result).toEqual({
          payload: {
            errors: [
              { message: 'any_message' },
              { message: 'any_message' }
            ]
          },
          statusCode: 401
        })
      })
    })

    describe('unprocessableEntity', () => {
      it('returns AppResponse with correct unprocessableEntity status and error', () => {
        const { sut, schemaErrorFake } = makeSut()

        const result = sut.unprocessableEntity([schemaErrorFake])

        expect(result).toEqual({
          payload: {
            error: {
              properties: {
                anyKey: { type: 'string' }
              },
              required: ['anyKey'],
              type: 'object'
            }
          },
          statusCode: 422
        })
      })

      it('returns AppResponse with correct unprocessableEntity status and errors', () => {
        const { sut, schemaErrorFake } = makeSut()

        const result = sut.unprocessableEntity([schemaErrorFake, schemaErrorFake])

        expect(result).toEqual({
          payload: {
            errors: [
              {
                properties: { anyKey: { type: 'string' } },
                required: ['anyKey'],
                type: 'object'
              },
              {
                properties: { anyKey: { type: 'string' } },
                required: ['anyKey'],
                type: 'object'
              }
            ]
          },
          statusCode: 422
        })
      })
    })
  })
})
