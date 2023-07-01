import { DomainError } from '@/common/0.domain/base/domain-error'
import { Entity } from '@/common/0.domain/base/entity'
import { ValueObject } from '@/common/0.domain/base/value-object'
import { type Either, left } from '@/common/0.domain/utils/either'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'
import { makeValueObjectStub } from '~/common/_doubles/stubs/value-object-stub'

type Props = {
  valueObject: ValueObject<any>
  invalidValueObject?: ValueObject<any>
}

type SutTypes = {
  errorFake: DomainError
  valueObjectStub: Either<DomainError[], ValueObject<any>>
  sut: typeof Entity
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    valueObjectStub: makeValueObjectStub()
  }
  const sut = Entity

  return {
    ...doubles,
    sut
  }
}

describe('Entity', () => {
  describe('success', () => {
    it('returns Right with props and valueObjects when all props are valid', () => {
      const { sut, valueObjectStub } = makeSut()

      const result = sut.validateProps<Props>({
        valueObject: valueObjectStub
      })

      expect(result.isRight()).toBe(true)
      expect(Object
        .values(result.value as Props)
        .every(item => item instanceof ValueObject)).toBe(true)
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
    it('returns Left with an array of errors when any prop is invalid', () => {
      const { sut, errorFake, valueObjectStub } = makeSut()

      const result = sut.validateProps<Props>({
        invalidValueObject: left([errorFake]),
        valueObject: valueObjectStub
      })

      expect(result.isLeft()).toBe(true)
      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })
  })
})
