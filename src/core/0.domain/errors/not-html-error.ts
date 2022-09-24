import { DomainError } from '@/core/0.domain/base/domain-error'

export class NotHtmlError extends DomainError {
  constructor (field: string, input: string) {
    super({
      message: 'should be a valid html',
      field,
      input
    })
  }
}
