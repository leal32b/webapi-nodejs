import { DomainError } from '@/core/0.domain/base/domain-error'

export class MaxLengthError extends DomainError {
  public static create (field: string, length: number, input: string): MaxLengthError {
    return new MaxLengthError({
      field,
      input,
      message: `should have a maximum of ${length} characters`
    })
  }
}
