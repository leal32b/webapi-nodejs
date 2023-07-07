import { DomainError } from '@/common/0.domain/base/domain-error'

export class MissingTokenError extends DomainError {
  public static create (): MissingTokenError {
    return new MissingTokenError({
      message: 'no Authorization token was provided'
    })
  }
}
