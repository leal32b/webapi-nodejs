import { DomainError } from '@/core/0.domain/base/domain-error'

export class NotHtmlError extends DomainError {
  public static create (field: string, input: string): NotHtmlError {
    return new NotHtmlError({
      message: 'should be a valid html',
      field,
      input
    })
  }
}
