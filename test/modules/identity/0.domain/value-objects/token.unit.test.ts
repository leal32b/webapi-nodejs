import { EmptyError } from '@/common/0.domain/errors/empty-error'
import { NullError } from '@/common/0.domain/errors/null-error'

import { Token } from '@/identity/0.domain/value-objects/token'

type SutTypes = {
  sut: typeof Token
}

const makeSut = (): SutTypes => {
  const sut = Token

  return { sut }
}

describe('Token', () => {
  describe('success', () => {
    it('returns Token when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_Token'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Token)
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
