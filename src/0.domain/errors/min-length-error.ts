import DomainError from '@/0.domain/base/domain-error'

export default class MinLengthError extends DomainError {
  constructor (field: string, length: number, input: string) {
    super({
      message: `should be at least ${length} characters long`,
      field,
      input
    })
  }
}
