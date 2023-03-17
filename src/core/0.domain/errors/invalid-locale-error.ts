import { DomainError } from '@/core/0.domain/base/domain-error'

export class InvalidLocaleError extends DomainError {
  public static create (field: string, input: string): InvalidLocaleError {
    return new InvalidLocaleError({
      field,
      input,
      message: "should have format: 'en_US'"
    })
  }
}
