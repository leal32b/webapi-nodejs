import { DomainError } from '@/common/0.domain/base/domain-error'

export class NullError extends DomainError {
  public static create (field: string, input: string): NullError {
    return new NullError({
      field,
      input,
      message: `should not be ${input}`
    })
  }
}
