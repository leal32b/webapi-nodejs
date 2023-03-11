import { DomainError } from '@/core/0.domain/base/domain-error'

export class InvalidPasswordError extends DomainError {
  public static create (): InvalidPasswordError {
    return new InvalidPasswordError({
      message: 'invalid username or password'
    })
  }
}
