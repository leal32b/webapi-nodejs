import Validator from '@/2.presentation/interfaces/validator'
import CompareFieldsValidator from '@/2.presentation/validators/compare-fields'
import EmailValidator from '@/2.presentation/validators/email'
import RequiredFieldValidator from '@/2.presentation/validators/required-fields'
import ValidatorComposite from '@/2.presentation/validators/validator-composite'
import EmailValidatorAdapter from '@/3.infra/validators/email-validator'

export const makeSignUpValidators = (): ValidatorComposite => {
  const validators: Validator[] = []
  const fields = ['name', 'email', 'password', 'passwordConfirmation']

  for (const field of fields) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
  validators.push(new EmailValidator({ extEmailValidator: new EmailValidatorAdapter(), fieldName: 'email' }))

  return new ValidatorComposite(validators)
}
