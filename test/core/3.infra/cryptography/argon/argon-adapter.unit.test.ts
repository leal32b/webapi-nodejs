import argon2id from 'argon2'

import { DomainError } from '@/core/0.domain/base/domain-error'
import { ArgonAdapter } from '@/core/3.infra/cryptography/argon/argon-adapter'

import { makeErrorFake } from '~/core/fakes/error-fake'

vi.mock('argon2', () => ({
  default: {
    hash: () => 'hashed_value',
    verify: () => true
  }
}))

type SutTypes = {
  sut: ArgonAdapter
  salt: number
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake()
  }
  const params = {
    salt: 12
  }
  const sut = ArgonAdapter.create(params)

  return { sut, ...params, ...doubles }
}

describe('ArgonAdapter', () => {
  describe('success', () => {
    it('calls argon with correct params', async () => {
      const { sut, salt } = makeSut()
      const hashSpy = vi.spyOn(argon2id, 'hash')
      const value = 'any_value'

      await sut.hash(value)

      expect(hashSpy).toHaveBeenCalledWith('any_value', { saltLength: salt })
    })

    it('returns Right on hash when it succeeds', async () => {
      const { sut } = makeSut()
      const value = 'any_value'

      const result = await sut.hash(value)

      expect(result.isRight()).toBe(true)
    })

    it('returns a hash', async () => {
      const { sut } = makeSut()
      const value = 'any_value'

      const result = await sut.hash(value)

      expect(result.value).toBe('hashed_value')
    })

    it('returns Right on compare when it succeeds', async () => {
      const { sut } = makeSut()
      const hash = 'hashed_value'
      const value = 'any_value'

      const result = await sut.compare(hash, value)

      expect(result.isRight()).toBe(true)
    })

    it('compares a hash with a value', async () => {
      const { sut } = makeSut()
      const hash = 'hashed_value'
      const value = 'any_value'

      const result = await sut.compare(hash, value)

      expect(result.value).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when argon.hash throws', async () => {
      const { sut, errorFake } = makeSut()
      vi.spyOn(argon2id, 'hash').mockRejectedValueOnce(errorFake as never)
      const value = 'any_value'

      const result = await sut.hash(value)

      expect(result.isLeft()).toBe(true)
    })

    it('returns an error when argon.hash throws', async () => {
      const { sut, errorFake } = makeSut()
      vi.spyOn(argon2id, 'hash').mockRejectedValueOnce(errorFake as never)
      const value = 'any_value'

      const result = await sut.hash(value)

      expect(result.value).toBeInstanceOf(DomainError)
    })

    it('returns Left when argon.verify throws', async () => {
      const { sut, errorFake } = makeSut()
      vi.spyOn(argon2id, 'verify').mockRejectedValueOnce(errorFake as never)
      const hash = 'hashed_value'
      const value = 'any_value'

      const result = await sut.compare(hash, value)

      expect(result.isLeft()).toBe(true)
    })

    it('returns an error when argon.verify throws', async () => {
      const { sut, errorFake } = makeSut()
      vi.spyOn(argon2id, 'verify').mockRejectedValueOnce(errorFake as never)
      const hash = 'hashed_value'
      const value = 'any_value'

      const result = await sut.compare(hash, value)

      expect(result.value).toBeInstanceOf(DomainError)
    })
  })
})
