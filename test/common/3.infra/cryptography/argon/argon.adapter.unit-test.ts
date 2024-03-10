import argon2id from 'argon2'

import { type DomainError } from '@/common/0.domain/base/domain-error'
import { ServerError } from '@/common/2.presentation/errors/server.error'
import { ArgonAdapter } from '@/common/3.infra/cryptography/argon/argon.adapter'

import { makeErrorFake } from '~/common/_doubles/fakes/error.fake'

vi.mock('argon2', () => ({
  default: {
    hash: () => 'hashed_value',
    verify: () => true
  }
}))

type SutTypes = {
  errorFake: DomainError
  salt: number
  sut: ArgonAdapter
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake()
  }
  const props = {
    salt: 12
  }
  const sut = ArgonAdapter.create(props)

  return {
    ...doubles,
    ...props,
    sut
  }
}

describe('ArgonAdapter', () => {
  describe('success', () => {
    it('calls argon.hash with correct params', async () => {
      const { sut, salt } = makeSut()
      const hashSpy = vi.spyOn(argon2id, 'hash')
      const value = 'any_value'

      await sut.hash(value)

      expect(hashSpy).toHaveBeenCalledWith('any_value', { hashLength: salt })
    })

    it('returns Right with hash on hash when it succeeds', async () => {
      const { sut } = makeSut()
      const value = 'any_value'

      const result = await sut.hash(value)

      expect(result.isRight()).toBe(true)
    })

    it('calls argon.verify with correct params', async () => {
      const { sut } = makeSut()
      const verifySpy = vi.spyOn(argon2id, 'verify')
      const hash = 'hashed_value'
      const value = 'any_value'

      await sut.compare(hash, value)

      expect(verifySpy).toHaveBeenCalledWith('hashed_value', 'any_value')
    })

    it('returns Right with true on compare when it succeeds', async () => {
      const { sut } = makeSut()
      const hash = 'hashed_value'
      const value = 'any_value'

      const result = await sut.compare(hash, value)

      expect(result.isRight()).toBe(true)
      expect(result.value).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left with ServerError when argon.hash throws', async () => {
      const { sut, errorFake } = makeSut()
      vi.spyOn(argon2id, 'hash').mockRejectedValueOnce(errorFake as never)
      const value = 'any_value'

      const result = await sut.hash(value)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when argon.verify throws', async () => {
      const { sut, errorFake } = makeSut()
      vi.spyOn(argon2id, 'verify').mockRejectedValueOnce(errorFake as never)
      const hash = 'hashed_value'
      const value = 'any_value'

      const result = await sut.compare(hash, value)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })
  })
})
