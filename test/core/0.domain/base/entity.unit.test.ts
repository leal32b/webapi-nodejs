import { DomainError } from '@/core/0.domain/base/domain-error'
import { Entity } from '@/core/0.domain/base/entity'
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

class ValueObjectFake extends ValueObject<any> {
  static create (): Either<DomainError[], ValueObjectFake> {
    return right(new ValueObjectFake(null))
  }
}

type Params = {
  valueObject: ValueObjectFake
}

type SutTypes = {
  sut: typeof Entity
  errorFake: DomainError
  valueObjectFake: Either<DomainError[], ValueObjectFake>
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    valueObjectFake: ValueObjectFake.create()
  }
  const sut = Entity

  return { sut, ...doubles }
}

describe('Entity', () => {
  describe('success', () => {
    it('returns Right when all params are valid', () => {
      const { sut, valueObjectFake } = makeSut()

      const result = sut.validateParams<Params>({
        valueObject: valueObjectFake
      })

      expect(result.isRight()).toBe(true)
    })

    it('returns an object with params and valueObjects when all params are valid', () => {
      const { sut, valueObjectFake } = makeSut()

      const result = sut.validateParams<Params>({
        valueObject: valueObjectFake
      })

      expect((result.value as Params).valueObject).toBeInstanceOf(ValueObjectFake)
    })
  })

  describe('failure', () => {
    it('returns Left when any param is invalid', () => {
      const { sut, errorFake, valueObjectFake } = makeSut()

      const result = sut.validateParams<Params>({
        valueObject: valueObjectFake,
        invalidValueObject: left([errorFake])
      })

      expect(result.isLeft()).toBe(true)
    })

    it('returns an array of errors when any param is invalid', () => {
      const { sut, errorFake, valueObjectFake } = makeSut()

      const result = sut.validateParams<Params>({
        valueObject: valueObjectFake,
        invalidValueObject: left([errorFake])
      })

      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })
  })
})
