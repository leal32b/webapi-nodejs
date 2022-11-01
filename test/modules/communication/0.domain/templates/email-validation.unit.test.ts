import { EmailValidation } from '@/communication/0.domain/templates/email-validation'
import { InvalidEmailError } from '@/core/0.domain/errors/invalid-email-error'

const makeSut = function (): any {
  const sut = EmailValidation
  const clientParam = {
    incorrectOne: 'jo@gmail.com',
    incorrectTwo: 'johndoe@gmail',
    incorrectTree: 'johndoe.com',
    correct: 'johndoe@gmail.com'
  }
  return {
    clientParam,
    sut
  }
}

describe('EmailValidation', () => {
  it('Should return InvalidEmailError of pass  email with small nameAddress', () => {
    const { sut, clientParam } = makeSut()
    const email = clientParam.incorrectOne
    const result = sut.build({ email })
    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toEqual(new InvalidEmailError('email', email))
  })
  it('Should return InvalidEmailError of pass email without @', () => {
    const { sut, clientParam } = makeSut()
    const email = clientParam.incorrectTree
    const result = sut.build({ email })
    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toEqual(new InvalidEmailError('email', email))
  })

  it('Should return InvalidEmailError of pass email without dote', () => {
    const { sut, clientParam } = makeSut()
    const email = clientParam.incorrectTwo
    const result = sut.build({ email })
    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toEqual(new InvalidEmailError('email', email))
  })
})

