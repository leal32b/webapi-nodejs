import { DomainError } from '@/core/0.domain/base/domain-error'

export class EmailTakenError extends DomainError {
  public static create (field: string, input: string): EmailTakenError {
    return new EmailTakenError({
      field,
      input,
      message: 'email already in use'
    })
  }
}
