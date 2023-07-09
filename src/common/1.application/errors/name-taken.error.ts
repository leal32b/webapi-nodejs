import { DomainError } from '@/common/0.domain/base/domain-error'

export class NameTakenError extends DomainError {
  public static create (field: string, input: string): NameTakenError {
    return new NameTakenError({
      field,
      input,
      message: 'name already in use'
    })
  }
}
