import { DomainError } from '@/core/0.domain/base/domain-error'

export class InvalidEmailError extends DomainError {
  public static create (field: string, input: string): InvalidEmailError {
    return new InvalidEmailError({
      field,
      input,
      message: "should have format: 'name@mail.com'"
    })
  }
}
