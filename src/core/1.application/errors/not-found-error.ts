import { DomainError } from '@/core/0.domain/base/domain-error'

export class NotFoundError extends DomainError {
  constructor (field: string, input: string) {
    super({
      field,
      input,
      message: `${field} '${input}' not found`
    })
  }
}
