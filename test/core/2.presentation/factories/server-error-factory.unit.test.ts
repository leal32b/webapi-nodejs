import { DomainError } from '@/core/0.domain/base/domain-error'
import { serverError } from '@/core/2.presentation/factories/server-error-factory'

import { makeErrorFake } from '~/core/fakes/error-fake'

type SutTypes = {
  sut: typeof serverError
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake()
  }
  const sut = serverError

  return { sut, ...doubles }
}

describe('serverError', () => {
  describe('success', () => {
    it('returns AppResponse with correct internalServerError status and error', () => {
      const { sut, errorFake } = makeSut()

      const result = sut.internalServerError(errorFake)

      expect(result).toEqual({
        payload: {
          error: {
            message: 'internal server error'
          }
        },
        statusCode: 500
      })
    })
  })
})
