import validator from 'validator'

import ExtEmailValidator from '@/2.adapter/interfaces/ext-email-validator'

export default class EmailValidatorAdapter implements ExtEmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
