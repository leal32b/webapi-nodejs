import { EmailValidator } from '@/2.adapter/interfaces/email-validator'
import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
