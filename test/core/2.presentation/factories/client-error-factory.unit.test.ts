import { type DomainError } from '@/core/0.domain/base/domain-error'
import { clientError } from '@/core/2.presentation/factories/client-error-factory'

import { makeErrorFake } from '~/core/_doubles/fakes/error-fake'

const makeSchemaErrorFake = (): any => ({
  properties: {
    anyKey: { type: 'string' }
  },
  required: ['anyKey'],
  type: 'object'
})

type SutTypes = {
  sut: typeof clientError
  errorFake: DomainError
  schemaErrorFake: any
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    schemaErrorFake: makeSchemaErrorFake()
  }
  const sut = clientError

  return { sut, ...doubles }
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
