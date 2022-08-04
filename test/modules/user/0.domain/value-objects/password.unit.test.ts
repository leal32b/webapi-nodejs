import { EmptyError } from '@/core/0.domain/errors/empty-error'
import { NullError } from '@/core/0.domain/errors/null-error'
import { Password } from '@/modules/user/0.domain/value-objects/password'

type SutTypes = {
  sut: typeof Password
}

const makeSut = (): SutTypes => {
  const sut = Password

  return { sut }
}

describe('Password', () => {
  describe('success', () => {
    it('returns a Password when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_password'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Password)
    })
  })

  describe('failure', () => {
    it('returns EmptyError when input is empty', () => {
      const { sut } = makeSut()
      const input = ''

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(EmptyError)
    })

    it('returns NullError when input is null', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(NullError)
    })
  })
})
