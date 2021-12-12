import validator from 'validator'

import EmailValidator from '@/2.adapter/interfaces/email-validator'

export default class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
