import DomainError from '@/0.domain/base/domain-error'
import Validator from '@/0.domain/base/validator'
import ValueObject from '@/0.domain/base/value-object'
import { Either, left, right } from '@/0.domain/utils/either'

const makeValidatorStub = (): Validator => ({
  validate: jest.fn((): Either<DomainError, true> => {
    return right(true)
  })
})

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

type SutTypes = {
  sut: typeof ValueObject
  validatorStub: Validator
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const collaborators = {
    validatorStub: makeValidatorStub(),
    errorFake: makeErrorFake()
  }
  const sut = ValueObject

  return { sut, ...collaborators }
}

describe('ValueObject', () => {
  describe('success', () => {
    it('returns Right if all validators pass', () => {
      const { sut, validatorStub } = makeSut()
      const input = 'any_input'

      const result = sut.validate(input, [validatorStub])

      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('failure', () => {
    it('returns an array of errors if any validator fails', () => {
      const { sut, validatorStub } = makeSut()
      const input = 'short'
      jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(left(makeErrorFake()))

      const result = sut.validate(input, [validatorStub])

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
