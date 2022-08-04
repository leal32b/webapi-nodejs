import { DomainError } from '@/0.domain/base/domain-error'

export class InvalidEmailError extends DomainError {
  constructor (field: string, input: string) {
    super({
      message: 'should have format: name@mail.com',
      field,
      input
    })
  }
}
