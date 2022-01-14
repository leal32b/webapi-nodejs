import InvalidParamError from '@/2.adapter/errors/invalid-param'
import ExtEmailValidator from '@/2.adapter/interfaces/ext-email-validator'
import EmailValidator from '@/2.adapter/validators/email'
import { makeExtEmailValidatorStub } from '~/2.adapter/stubs/email-validator.stub'

type SutTypes = {
  sut: EmailValidator
  extEmailValidator: ExtEmailValidator
}

const makeSut = (): SutTypes => {
  const injection = {
    extEmailValidator: makeExtEmailValidatorStub(),
    fieldName: 'email'
  }
  const sut = new EmailValidator(injection)

  return { sut, ...injection }
}

describe('EmailValidator', () => {
  it('should call EmailValidator with correct email', () => {
    const { sut, extEmailValidator } = makeSut()
    const isValidSpy = jest.spyOn(extEmailValidator, 'isValid')
    sut.validate({ email: 'any_email@mail.com' })

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should return an error if EmailValidator returns false', () => {
    const { sut, extEmailValidator } = makeSut()
    jest.spyOn(extEmailValidator, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'any_email@mail.com' })

    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should throw if EmailValidator throws', () => {
    const { sut, extEmailValidator } = makeSut()
    jest.spyOn(extEmailValidator, 'isValid').mockImplementationOnce(() => { throw new Error() })

    expect(sut.validate).toThrow()
  })
})
