import { DomainError } from '@/core/0.domain/base/domain-error'

export class EmailTakenError extends DomainError {
  constructor (field: string, input: string) {
    super({
      message: 'email already in use',
      field,
      input
    })
  }
}
