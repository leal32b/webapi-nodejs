import { DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either, right } from '@/core/0.domain/utils/either'

export const makeValueObjectStub = (): Either<DomainError[], ValueObject<any>> => {
  class ValueObjectStub extends ValueObject<any> {
    static create (): Either<DomainError[], ValueObjectStub> {
      return right(new ValueObjectStub('any_value'))
    }
  }

  return ValueObjectStub.create()
}
