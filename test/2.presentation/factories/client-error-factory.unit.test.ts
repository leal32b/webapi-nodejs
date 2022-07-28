import DomainError from '@/0.domain/base/domain-error'
import { clientError } from '@/2.presentation/factories/client-error-factory'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

type SutTypes = {
  sut: typeof clientError
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake()
  }
  const sut = clientError

  return { sut, ...fakes }
}

describe('clientError', () => {
  describe('success', () => {
    it('returns AppResponse with badRequest status', () => {
      const { sut, errorFake } = makeSut()

      const result = sut.badRequest(errorFake)

      expect(result).toEqual({
        payload: expect.any(DomainError),
        statusCode: 400
      })
    })

    it('returns AppResponse with unauthorized status', () => {
      const { sut, errorFake } = makeSut()

      const result = sut.unauthorized(errorFake)

      expect(result).toEqual({
        payload: expect.any(DomainError),
        statusCode: 401
      })
    })
  })
})
