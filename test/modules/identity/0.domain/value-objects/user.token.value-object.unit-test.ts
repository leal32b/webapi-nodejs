import { EmptyError } from '@/common/0.domain/errors/empty.error'
import { NullError } from '@/common/0.domain/errors/null.error'

import { UserToken } from '@/identity/0.domain/value-objects/user.token.value-object'

type SutTypes = {
  sut: typeof UserToken
}

const makeSut = (): SutTypes => {
  const sut = UserToken

  return { sut }
}

describe('UserToken', () => {
  describe('success', () => {
    it('returns UserToken when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_Token'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(UserToken)
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
