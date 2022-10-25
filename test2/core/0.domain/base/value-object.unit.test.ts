import { vi } from 'vitest'

import { DomainError } from '@/core/0.domain/base/domain-error'
import { Validator } from '@/core/0.domain/base/validator'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either, left, right } from '@/core/0.domain/utils/either'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeValidatorStub = (): Validator<any> => ({
  validate: vi.fn((): Either<DomainError, void> => {
    return right()
  })
})

type SutTypes = {
  sut: typeof ValueObject
  validator: Validator<any>
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    validator: makeValidatorStub()
  }
  const sut = ValueObject

  return { sut, ...doubles }
}

describe('ValueObject', () => {
  describe('success', () => {
    it.only('returns Right when all validators pass', () => {
      const { sut, validator } = makeSut()
      const input = 'any_input'

      const result = sut.validate(input, [validator])

      expect(result.isRight()).toBe(true)
    })

    it('returns Right when input is an array and all validators pass', () => {
      const { sut, validator } = makeSut()
      const input = ['any_input', 'any_input']

      const result = sut.validate(input, [validator])

      expect(result.isRight()).toBe(true)
    })

    it('returns undefined when all validators pass', () => {
      const { sut, validator } = makeSut()
      const input = 'any_input'

      const result = sut.validate(input, [validator])

      expect(result.value).toBe(undefined)
    })
  })

  describe('failure', () => {
    it('returns Left when any validator fails', () => {
      const { sut, validator, errorFake } = makeSut()
      const input = 'short'
      jest.spyOn(validator, 'validate').mockReturnValue(left(errorFake))

      const result = sut.validate(input, [validator])

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when input is an array and any validator fails', () => {
      const { sut, validator, errorFake } = makeSut()
      const input = ['short', 'short']
      jest.spyOn(validator, 'validate').mockReturnValue(left(errorFake))

      const result = sut.validate(input, [validator])

      expect(result.isLeft()).toBe(true)
    })

    it('returns an array of errors when any validator fails', () => {
      const { sut, validator, errorFake } = makeSut()
      const input = 'short'
      jest.spyOn(validator, 'validate').mockReturnValue(left(errorFake))

      const result = sut.validate(input, [validator])

      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })
  })
})
