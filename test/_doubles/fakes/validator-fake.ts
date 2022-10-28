import { DomainError } from '@/core/0.domain/base/domain-error'
import { Validator } from '@/core/0.domain/base/validator'
import { Either, right } from '@/core/0.domain/utils/either'

export const makeValidatorFake = (): Validator<any> => {
  class ValidatorFake extends Validator<any> {
    public static create (): ValidatorFake {
      return new ValidatorFake()
    }

    public validate (field: string, input: any): Either<DomainError, void> {
      return right()
    }
  }

  return ValidatorFake.create()
}
