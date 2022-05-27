import ExtEmailValidator from '@/2.presentation/interfaces/ext-email-validator'

export const makeExtEmailValidatorStub = (): ExtEmailValidator => {
  class ExtEmailValidatorStub implements ExtEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new ExtEmailValidatorStub()
}