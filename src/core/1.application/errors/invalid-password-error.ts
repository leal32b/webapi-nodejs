import { DomainError } from '@/core/0.domain/base/domain-error'

export class InvalidPasswordError extends DomainError {
  constructor () {
    super({
      message: 'invalid username or password'
    })
  }
}
