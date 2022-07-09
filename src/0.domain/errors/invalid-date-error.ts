import DomainError from '@/0.domain/base/domain-error'

export default class InvalidDateError extends DomainError {
  constructor (field: string, input: string) {
    super({
      message: 'should have format: "yyyy-MM-ddTHH:mm:ss.fffZ"',
      field,
      input
    })
  }
}
