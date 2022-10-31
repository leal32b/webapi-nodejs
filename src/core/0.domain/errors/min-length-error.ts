import { DomainError } from '@/core/0.domain/base/domain-error'

export class MinLengthError extends DomainError {
  public static create (field: string, length: number, input: string): MinLengthError {
    return new MinLengthError({
      message: `should be at least ${length} characters long`,
      field,
      input
    })
  }
}
