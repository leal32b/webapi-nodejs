import { DomainError } from '@/core/0.domain/base/domain-error'

export class InvalidPasswordError extends DomainError {
  constructor (field: string) {
    super({
      message: 'passwords should match',
      field
    })
  }
}
