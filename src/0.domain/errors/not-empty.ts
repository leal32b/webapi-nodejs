import DomainError from '@/0.domain/base/domain-error'

export default class NotEmptyError extends DomainError {
  constructor (field: string, input: string) {
    const adjustedInput = input === '' ? 'empty' : input

    super({
      message: `should not be ${adjustedInput}`,
      field,
      input
    })
  }
}
