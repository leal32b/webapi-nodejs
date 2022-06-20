import DomainError from '@/0.domain/base/domain-error'

export default class InvalidPasswordError extends DomainError {
  constructor (field: string) {
    super({
      message: 'passwords should match',
      field
    })
  }
}
