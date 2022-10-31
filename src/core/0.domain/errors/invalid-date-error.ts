import { DomainError } from '@/core/0.domain/base/domain-error'

export class InvalidDateError extends DomainError {
  public static create (field: string, input: string): InvalidDateError {
    return new InvalidDateError({
      message: "should have format: 'yyyy-MM-ddTHH:mm:ss.fffZ'",
      field,
      input
    })
  }
}
