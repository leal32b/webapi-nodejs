import DomainError from '@/0.domain/base/domain-error'

export default class EmptyError extends DomainError {
  constructor (field: string, input: string) {
    super({
      message: 'should not be empty',
      field,
      input
    })
  }
}