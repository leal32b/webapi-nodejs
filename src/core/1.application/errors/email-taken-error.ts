import { DomainError } from '@/core/0.domain/base/domain-error'

export class EmailTakenError extends DomainError {
  constructor (field: string, input: string) {
    super({
      field,
      input,
      message: 'email already in use'
    })
  }
}
