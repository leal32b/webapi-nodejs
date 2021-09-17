import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', async () => {
    const sut = new EmailValidatorAdapter()

    const isValid = await sut.isValid('invalid_email@mail.com')
    expect(isValid).toBeFalsy()
  })
})
