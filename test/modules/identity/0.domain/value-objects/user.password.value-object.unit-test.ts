import { EmptyError } from '@/common/0.domain/errors/empty.error'
import { NullError } from '@/common/0.domain/errors/null.error'

import { UserPassword } from '@/identity/0.domain/value-objects/user.password.value-object'

type SutTypes = {
  sut: typeof UserPassword
}

const makeSut = (): SutTypes => {
  const sut = UserPassword

  return { sut }
}

describe('UserPassword', () => {
  describe('success', () => {
    it('returns UserPassword when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_password'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(UserPassword)
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
