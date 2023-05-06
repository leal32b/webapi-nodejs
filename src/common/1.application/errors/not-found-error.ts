import { DomainError } from '@/common/0.domain/base/domain-error'

export class NotFoundError extends DomainError {
  public static create (field: string, input: string): NotFoundError {
    return new NotFoundError({
      field,
      input,
      message: `${field} '${input}' not found`
    })
  }
}
