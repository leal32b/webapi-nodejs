import DomainError from '@/0.domain/base/domain-error'
import { success } from '@/2.presentation/factories/success-factory'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

type SutTypes = {
  sut: typeof success
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake()
  }
  const sut = success

  return { sut, ...fakes }
}

describe('success', () => {
  describe('success', () => {
    it('returns AppResponse with ok status', () => {
      const { sut } = makeSut()
      const payload = { anyKey: 'any_value' }

      const result = sut.ok(payload)

      expect(result).toEqual({
        payload: { anyKey: 'any_value' },
        statusCode: 200
      })
    })
  })
})
