import { DomainError } from '@/common/0.domain/base/domain-error'

export class MissingAuthError extends DomainError {
  public static create (auth: string[]): MissingAuthError {
    return new MissingAuthError({
      message: `user must have at least one of these permissions: ${auth.join()}`
    })
  }
}
