import EmailValidator from '@/2.adapter/interfaces/email-validator'

export default class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}
