import { DomainError } from '@/0.domain/base/domain-error'
import { Validator } from '@/0.domain/base/validator'
import { ValueObject } from '@/0.domain/base/value-object'
import { Either, left, right } from '@/0.domain/utils/either'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeValidatorStub = (): Validator<any> => ({
  validate: jest.fn((): Either<DomainError, void> => {
    return right(null)
  })
})

type SutTypes = {
  sut: typeof ValueObject
  validator: Validator<any>
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake()
  }
  const collaborators = {
    validator: makeValidatorStub()
  }
  const sut = ValueObject

  return { sut, ...collaborators, ...fakes }
}

describe('ValueObject', () => {
  describe('success', () => {
    it('returns Right when all validators pass', () => {
      const { sut, validator } = makeSut()
      const input = 'any_input'

      const result = sut.validate(input, [validator])

      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('failure', () => {
    it('returns an array of errors when any validator fails', () => {
      const { sut, validator, errorFake } = makeSut()
      const input = 'short'
      jest.spyOn(validator, 'validate').mockReturnValueOnce(left(errorFake))

      const result = sut.validate(input, [validator])

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
