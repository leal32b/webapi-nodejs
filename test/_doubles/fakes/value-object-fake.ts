import { DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either, right } from '@/core/0.domain/utils/either'

export const makeValueObjectCreateFake = (): Either<DomainError[], ValueObject<any>> => {
  class ValueObjectFake extends ValueObject<any> {
    static create (): Either<DomainError[], ValueObjectFake> {
      return right(new ValueObjectFake('any_value'))
    }
  }

  return ValueObjectFake.create()
}
