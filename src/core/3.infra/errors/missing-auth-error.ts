import { DomainError } from '@/core/0.domain/base/domain-error'

export class MissingAuthError extends DomainError {
  constructor (auth: string[]) {
    super({
      message: `user must have at least one of these permissions: ${auth.join()}`
    })
  }
}
