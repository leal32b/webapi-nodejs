import DomainError from '@/0.domain/base/domain-error'

export default class NotFoundError extends DomainError {
  constructor (field: string, input: string) {
    super({
      message: `${field} "${input}" not found`,
      field,
      input
    })
  }
}
