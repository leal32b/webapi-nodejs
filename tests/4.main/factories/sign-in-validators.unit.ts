import Validator from '@/2.adapter/interfaces/validator'
import EmailValidator from '@/2.adapter/validators/email'
import RequiredFieldValidator from '@/2.adapter/validators/required-fields'
import ValidatorComposite from '@/2.adapter/validators/validator-composite'
import { makeSignInValidators } from '@/4.main/factories/sign-in-validators'
import { makeExtEmailValidatorStub } from '~/2.adapter/stubs/email-validator.stub'

jest.mock('@/2.adapter/validators/validator-composite')

describe('SignInValidators Factory', () => {
  it('should call ValidatorComposite with all validators', () => {
    makeSignInValidators()
    const validators: Validator[] = []
    const fields = ['email', 'password']

    for (const field of fields) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new EmailValidator({ extEmailValidator: makeExtEmailValidatorStub(), fieldName: 'email' }))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
