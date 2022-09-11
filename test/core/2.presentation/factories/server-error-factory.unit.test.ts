import { DomainError } from '@/core/0.domain/base/domain-error'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { serverError } from '@/core/2.presentation/factories/server-error-factory'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

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
    it('returns AppResponse with internalServerError status', () => {
      const { sut, errorFake } = makeSut()

      const result = sut.internalServerError(errorFake)

      expect(result).toEqual({
        payload: expect.any(ServerError),
        statusCode: 500
      })
    })
  })
})
