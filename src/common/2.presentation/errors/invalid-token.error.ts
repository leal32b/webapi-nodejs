import { DomainError } from '@/common/0.domain/base/domain-error'

export class InvalidTokenError extends DomainError {
  public static create (type: string): InvalidTokenError {
    return new InvalidTokenError({
      message: `token is invalid (type: ${type})`
    })
  }
}
