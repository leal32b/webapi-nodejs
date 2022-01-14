import Validator from '@/2.adapter/interfaces/validator'
import CompareFieldsValidator from '@/2.adapter/validators/compare-fields'
import EmailValidator from '@/2.adapter/validators/email'
import RequiredFieldValidator from '@/2.adapter/validators/required-fields'
import ValidatorComposite from '@/2.adapter/validators/validator-composite'
import { makeSignUpValidators } from '@/4.main/factories/sign-up-validators'
import { makeExtEmailValidatorStub } from '~/2.adapter/stubs/email-validator.stub'

jest.mock('@/2.adapter/validators/validator-composite')

describe('SignUpValidators Factory', () => {
  it('should call ValidatorComposite with all validators', () => {
    makeSignUpValidators()
    const validators: Validator[] = []
    const fields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of fields) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    validators.push(new EmailValidator({ extEmailValidator: makeExtEmailValidatorStub(), fieldName: 'email' }))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
