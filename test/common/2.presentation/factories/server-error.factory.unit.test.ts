import { type DomainError } from '@/common/0.domain/base/domain-error'
import { serverError } from '@/common/2.presentation/factories/server-error.factory'

import { makeErrorFake } from '~/common/_doubles/fakes/error.fake'

type SutTypes = {
  errorFake: DomainError
  sut: typeof serverError
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake()
  }
  const sut = serverError

  return {
    ...doubles,
    sut
  }
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
