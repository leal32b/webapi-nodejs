import { DomainError } from '@/core/0.domain/base/domain-error'

export class PasswordMismatchError extends DomainError {
  constructor (field: string) {
    super({
      field,
      message: 'passwords should match'
    })
  }
}
