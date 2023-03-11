import { DomainError } from '@/core/0.domain/base/domain-error'

export class EmptyError extends DomainError {
  public static create (field: string, input: string): EmptyError {
    return new EmptyError({
      field,
      input,
      message: 'should not be empty'
    })
  }
}
