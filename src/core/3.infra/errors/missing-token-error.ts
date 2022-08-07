import { DomainError } from '@/core/0.domain/base/domain-error'

export class MissingTokenError extends DomainError {
  constructor () {
    super({
      message: 'no Authorization token was provided'
    })
  }
}
