import { DomainError } from '@/0.domain/base/domain-error'

export class ServerError extends DomainError {
  constructor (message: string, stack: string) {
    super({
      message,
      stack
    })
  }
}
