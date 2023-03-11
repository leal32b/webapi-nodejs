import { type DomainError } from '@/core/0.domain/base/domain-error'
import { Validator } from '@/core/0.domain/base/validator'
import { type Either, right } from '@/core/0.domain/utils/either'

export const makeValidatorStub = (): Validator<any> => {
  class ValidatorStub extends Validator<any> {
    public static create (): ValidatorStub {
      return new ValidatorStub()
    }

    public validate (): Either<DomainError, void> {
      return right()
    }
  }

  return ValidatorStub.create()
}
