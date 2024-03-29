import { DomainError } from '@/common/0.domain/base/domain-error'
import { type Validator } from '@/common/0.domain/base/validator'
import { ValueObject } from '@/common/0.domain/base/value-object'
import { left } from '@/common/0.domain/utils/either'

import { makeErrorFake } from '~/common/_doubles/fakes/error.fake'
import { makeValidatorStub } from '~/common/_doubles/stubs/validator.stub'

type SutTypes = {
  errorFake: DomainError
  validatorStub: Validator<any>
  sut: typeof ValueObject
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    validatorStub: makeValidatorStub()
  }
  const sut = ValueObject

  return {
    ...doubles,
    sut
  }
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
      const { sut, validatorStub } = makeSut()
      const input = 'any_input'

      const result = sut.validate(input, [validatorStub])

      expect(result.isRight()).toBe(true)
    })

    it('returns Right when input is an array and all validators pass', () => {
      const { sut, validatorStub } = makeSut()
      const input = ['any_input', 'any_input']

      const result = sut.validate(input, [validatorStub])

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left with an array of errors when any validatorStub fails', () => {
      const { sut, validatorStub, errorFake } = makeSut()
      const input = 'short'
      vi.spyOn(validatorStub, 'validate').mockReturnValue(left(errorFake))

      const result = sut.validate(input, [validatorStub])

      expect(result.isLeft()).toBe(true)
      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })

    it('returns Left with an array of errors when input is an array and any validatorStub fails', () => {
      const { sut, validatorStub, errorFake } = makeSut()
      const input = ['short', 'short']
      vi.spyOn(validatorStub, 'validate').mockReturnValue(left(errorFake))

      const result = sut.validate(input, [validatorStub])

      expect(result.isLeft()).toBe(true)
      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })
  })
})
