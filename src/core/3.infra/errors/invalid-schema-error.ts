import { DomainError } from '@/core/0.domain/base/domain-error'

export class InvalidSchemaError extends DomainError {
  public static create (): InvalidSchemaError {
    return new InvalidSchemaError({
      message: 'schema is invalid'
    })
  }
}
