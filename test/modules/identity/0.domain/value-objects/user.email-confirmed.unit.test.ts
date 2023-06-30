import { NullError } from '@/common/0.domain/errors/null-error'

import { UserEmailConfirmed } from '@/identity/0.domain/value-objects/user.email-confirmed'

type SutTypes = {
  sut: typeof UserEmailConfirmed
}

const makeSut = (): SutTypes => {
  const sut = UserEmailConfirmed

  return { sut }
}

describe('UserEmailConfirmed', () => {
  describe('success', () => {
    it('returns EmailConfirmed when input is valid', () => {
      const { sut } = makeSut()
      const input = true

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(UserEmailConfirmed)
    })
  })

  describe('failure', () => {
    it('returns NullError when input is null', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(NullError)
    })
  })
})
