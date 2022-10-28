import { DomainError } from '@/core/0.domain/base/domain-error'
import { Validator } from '@/core/0.domain/base/validator'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { left } from '@/core/0.domain/utils/either'

import { makeErrorFake } from '~/doubles/fakes/error-fake'
import { makeValidatorFake } from '~/doubles/fakes/validator-fake'

type SutTypes = {
  sut: typeof ValueObject
  errorFake: DomainError
  validatorFake: Validator<any>
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    validatorFake: makeValidatorFake()
  }
  const sut = ValueObject

  return { sut, ...doubles }
}

describe('ValueObject', () => {
  describe('success', () => {
    it('creates a new ValueObject with a concrete class', async () => {
      const { sut } = makeSut()
      const value = 'any_value'
      class ValueObjectFake extends sut<any> {
        public static create (value: any): ValueObjectFake {
          return new ValueObjectFake(value)
        }
      }

      const result = ValueObjectFake.create(value)

      expect(result).toBeInstanceOf(ValueObject)
    })

    it('returns Right when all validators pass', () => {
      const { sut, validatorFake } = makeSut()
      const input = 'any_input'

      const result = sut.validate(input, [validatorFake])

      expect(result.isRight()).toBe(true)
    })

    it('returns Right when input is an array and all validators pass', () => {
      const { sut, validatorFake } = makeSut()
      const input = ['any_input', 'any_input']

      const result = sut.validate(input, [validatorFake])

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when any validatorFake fails', () => {
      const { sut, validatorFake, errorFake } = makeSut()
      const input = 'short'
      vi.spyOn(validatorFake, 'validate').mockReturnValue(left(errorFake))

      const result = sut.validate(input, [validatorFake])

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when input is an array and any validatorFake fails', () => {
      const { sut, validatorFake, errorFake } = makeSut()
      const input = ['short', 'short']
      vi.spyOn(validatorFake, 'validate').mockReturnValue(left(errorFake))

      const result = sut.validate(input, [validatorFake])

      expect(result.isLeft()).toBe(true)
    })

    it('returns an array of errors when any validatorFake fails', () => {
      const { sut, validatorFake, errorFake } = makeSut()
      const input = 'short'
      vi.spyOn(validatorFake, 'validate').mockReturnValue(left(errorFake))

      const result = sut.validate(input, [validatorFake])

      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })
  })
})
