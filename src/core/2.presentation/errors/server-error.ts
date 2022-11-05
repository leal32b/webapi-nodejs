import { DomainError } from '@/core/0.domain/base/domain-error'

export class ServerError extends DomainError {
  public static create (message: string, stack?: string): ServerError {
    return new ServerError({
      message,
      ...(stack && { stack })
    })
  }
}
