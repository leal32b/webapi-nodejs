import { DomainError } from '@/core/0.domain/base/domain-error'

export class InvalidSchemaError extends DomainError {
  constructor () {
    super({
      message: 'schema is invalid'
    })
  }
}
