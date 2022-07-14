import DomainError from '@/0.domain/base/domain-error'

export default class EmailTakenError extends DomainError {
  constructor (field: string, input: string) {
    super({
      message: 'email already in use',
      field,
      input
    })
  }
}
