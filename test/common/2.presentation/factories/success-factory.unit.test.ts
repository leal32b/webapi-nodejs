import { type DomainError } from '@/common/0.domain/base/domain-error'
import { success } from '@/common/2.presentation/factories/success-factory'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'

type SutTypes = {
  errorFake: DomainError
  sut: typeof success
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake()
  }
  const sut = success

  return {
    ...doubles,
    sut
  }
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
