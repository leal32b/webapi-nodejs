import { DomainError } from '@/0.domain/base/domain-error'
import { Entity } from '@/0.domain/base/entity'
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

class ValueObjectFake extends ValueObject<any> {
  static create (): Either<DomainError[], ValueObjectFake> {
    return right(new ValueObjectFake(null))
  }
}

type Params = {
  valueObjectFake: ValueObjectFake
}

type SutTypes = {
  sut: typeof Entity
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake()
  }
  const sut = Entity

  return { sut, ...fakes }
}

describe('Entity', () => {
  describe('success', () => {
    it('returns Right when all params are valid', () => {
      const { sut } = makeSut()

      const result = sut.validateParams<Params>({
        valueObjectFake: ValueObjectFake.create()
      })

      expect(result.isRight()).toBeTruthy()
    })

    it('returns an object with params and value-objects when all params are valid', () => {
      const { sut } = makeSut()

      const result = sut.validateParams<Params>({
        valueObjectFake: ValueObjectFake.create()
      })

      expect((result.value as Params).valueObjectFake).toBeInstanceOf(ValueObjectFake)
    })
  })

  describe('failure', () => {
    it('returns an array of errors when any param is invalid', () => {
      const { sut, errorFake } = makeSut()

      const result = sut.validateParams<Params>({
        valueObjectFake: left([errorFake])
      })

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
