import { DomainError } from '@/common/0.domain/base/domain-error'

export class InvalidDateError extends DomainError {
  public static create (field: string, input: string): InvalidDateError {
    return new InvalidDateError({
      field,
      input,
      message: "should have format: 'yyyy-MM-ddTHH:mm:ss.fffZ'"
    })
  }
}
