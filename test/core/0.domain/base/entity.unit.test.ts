import { DomainError } from '@/core/0.domain/base/domain-error'
import { Entity } from '@/core/0.domain/base/entity'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { type Either, left } from '@/core/0.domain/utils/either'

import { makeErrorFake } from '~/core/fakes/error-fake'
import { makeValueObjectStub } from '~/core/stubs/value-object-stub'

type Params = {
  valueObject: ValueObject<any>
}

type SutTypes = {
  sut: typeof Entity
  errorFake: DomainError
  valueObjectStub: Either<DomainError[], ValueObject<any>>
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    valueObjectStub: makeValueObjectStub()
  }
  const sut = Entity

  return { sut, ...doubles }
}

describe('Entity', () => {
  describe('success', () => {
    it('returns Right when all params are valid', () => {
      const { sut, valueObjectStub } = makeSut()

      const result = sut.validateParams<Params>({
        valueObject: valueObjectStub
      })

      expect(result.isRight()).toBe(true)
    })

    it('returns an object with params and valueObjects when all params are valid', () => {
      const { sut, valueObjectStub } = makeSut()

      const result = sut.validateParams<Params>({
        valueObject: valueObjectStub
      })

      expect((result.value as Params).valueObject).toBeInstanceOf(ValueObject)
    })

    it('creates a new Entity with a concrete class', async () => {
      const { sut } = makeSut()
      const props = { anyKey: 'any_value' }
      class EntityFake extends sut<any> {
        public static create (props: any): EntityFake {
          return new EntityFake(props)
        }
      }

      const result = EntityFake.create(props)

      expect(result).toBeInstanceOf(Entity)
    })
  })

  describe('failure', () => {
    it('returns Left when any param is invalid', () => {
      const { sut, errorFake, valueObjectStub } = makeSut()

      const result = sut.validateParams<Params>({
        invalidValueObject: left([errorFake]),
        valueObject: valueObjectStub
      })

      expect(result.isLeft()).toBe(true)
    })

    it('returns an array of errors when any param is invalid', () => {
      const { sut, errorFake, valueObjectStub } = makeSut()

      const result = sut.validateParams<Params>({
        invalidValueObject: left([errorFake]),
        valueObject: valueObjectStub
      })

      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })
  })
})
