import { DomainError } from '@/common/0.domain/base/domain-error'

export class NotHtmlError extends DomainError {
  public static create (field: string, input: string): NotHtmlError {
    return new NotHtmlError({
      field,
      input,
      message: 'should be a valid html'
    })
  }
}
