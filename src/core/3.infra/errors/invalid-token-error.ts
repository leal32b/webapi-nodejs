import { DomainError } from '@/core/0.domain/base/domain-error'

export class InvalidTokenError extends DomainError {
  constructor (type: string) {
    super({
      message: `token is invalid (type: ${type})`
    })
  }
}
