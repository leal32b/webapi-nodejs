import ExtEmailValidator from '@/2.adapter/interfaces/ext-email-validator'

export default class ExtEmailValidatorStub implements ExtEmailValidator {
  isValid (email: string): boolean {
    return true
  }
}
