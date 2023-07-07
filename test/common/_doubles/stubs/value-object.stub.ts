import { type DomainError } from '@/common/0.domain/base/domain-error'
import { ValueObject } from '@/common/0.domain/base/value-object'
import { type Either, right } from '@/common/0.domain/utils/either'

export const makeValueObjectStub = (): Either<DomainError[], ValueObject<any>> => {
  class ValueObjectStub extends ValueObject<any> {
    static create (): Either<DomainError[], ValueObjectStub> {
      return right(new ValueObjectStub('any_value'))
    }
  }

  return ValueObjectStub.create()
}
