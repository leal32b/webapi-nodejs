import { DomainError } from '@/0.domain/base/domain-error'

export class MaxLengthError extends DomainError {
  constructor (field: string, length: number, input: string) {
    super({
      message: `should have a maximum of ${length} characters`,
      field,
      input
    })
  }
}
