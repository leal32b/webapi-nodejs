import { DomainError } from '@/core/0.domain/base/domain-error'

export class PasswordMismatchError extends DomainError {
  constructor (field: string) {
    super({
      message: 'passwords should match',
      field
    })
  }
}
