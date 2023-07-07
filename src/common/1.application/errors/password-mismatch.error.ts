import { DomainError } from '@/common/0.domain/base/domain-error'

export class PasswordMismatchError extends DomainError {
  public static create (field: string): PasswordMismatchError {
    return new PasswordMismatchError({
      field,
      message: 'passwords should match'
    })
  }
}
