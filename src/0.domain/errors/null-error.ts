import DomainError from '@/0.domain/base/domain-error'

export default class NullError extends DomainError {
  constructor (field: string, input: string) {
    super({
      message: `should not be ${input}`,
      field,
      input
    })
  }
}
