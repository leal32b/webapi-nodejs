import DomainError from '@/0.domain/base/domain-error'
import Entity from '@/0.domain/base/entity'
import ValueObject from '@/0.domain/base/value-object'
import { Either, left, right } from '@/0.domain/utils/either'

class ValueObjectFake extends ValueObject {
  static create (): Either<DomainError[], ValueObjectFake> {
    return right(new ValueObjectFake())
  }
}

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

type Params = {
  valueObjectFake: ValueObjectFake
}

type SutTypes = {
  sut: typeof Entity
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const collaborators = {
    errorFake: makeErrorFake()
  }
  const sut = Entity

  return { sut, ...collaborators }
}

describe('Entity', () => {
  describe('success', () => {
    it('returns Right if all params are valid', () => {
      const { sut } = makeSut()

      const result = sut.validateParams<Params>({
        valueObjectFake: ValueObjectFake.create()
      })

      expect(result.isRight()).toBeTruthy()
    })

    it('returns an object with params and value-objects if all params are valid', () => {
      const { sut } = makeSut()

      const result = sut.validateParams<Params>({
        valueObjectFake: ValueObjectFake.create()
      })

      expect((result.value as any).valueObjectFake).toBeInstanceOf(ValueObjectFake)
    })
  })

  describe('failure', () => {
    it('returns an array with errors if any param is invalid', () => {
      const { sut } = makeSut()

      const result = sut.validateParams<Params>({
        valueObjectFake: left([makeErrorFake()])
      })

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
