import { DomainError } from '@/core/0.domain/base/domain-error'

export class MinLengthError extends DomainError {
  constructor (field: string, length: number, input: string) {
    super({
      message: `should be at least ${length} characters long`,
      field,
      input
    })
  }
}
