import { type DomainError } from '@/core/0.domain/base/domain-error'
import { success } from '@/core/2.presentation/factories/success-factory'

import { makeErrorFake } from '~/core/_doubles/fakes/error-fake'

type SutTypes = {
  sut: typeof success
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake()
  }
  const sut = success

  return { sut, ...doubles }
}

describe('success', () => {
  describe('success', () => {
    it('returns AppResponse with ok status', () => {
      const { sut } = makeSut()
      const payload = { anyKey: 'any_value' }

      const result = sut.ok(payload)

      expect(result).toEqual({
        payload: { anyKey: 'any_value' },
        statusCode: 200
      })
    })
  })
})
