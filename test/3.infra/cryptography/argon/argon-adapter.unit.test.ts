import argon2id from 'argon2'

import DomainError from '@/0.domain/base/domain-error'
import ArgonAdapter from '@/3.infra/cryptography/argon/argon-adapter'

jest.mock('argon2', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashed_value')
  },
  async verify (): Promise<boolean> {
    return await Promise.resolve(true)
  }
}))

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

type SutTypes = {
  sut: ArgonAdapter
  salt: number
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake()
  }
  const injection = {
    salt: 12
  }
  const sut = new ArgonAdapter(injection)

  return { sut, ...injection, ...fakes }
}

describe('ArgonAdapter', () => {
  describe('success', () => {
    it('calls argon with correct params', async () => {
      const { sut, salt } = makeSut()
      const hashSpy = jest.spyOn(argon2id, 'hash')

      await sut.hash('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', { saltLength: salt })
    })

    it('returns a hash', async () => {
      const { sut } = makeSut()

      const result = await sut.hash('any_value')

      expect(result.value).toBe('hashed_value')
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
      jest.spyOn(argon2id, 'hash').mockRejectedValueOnce(errorFake as never)

      const result = await sut.hash('any_value')

      expect(result.isLeft()).toBeTruthy()
    })

    it('returns an error when argon.hash throws', async () => {
      const { sut, errorFake } = makeSut()
      jest.spyOn(argon2id, 'hash').mockRejectedValueOnce(errorFake as never)

      const result = await sut.hash('any_value')

      expect(result.value).toBeInstanceOf(DomainError)
    })

    it('returns Left when argon.verify throws', async () => {
      const { sut, errorFake } = makeSut()
      jest.spyOn(argon2id, 'verify').mockRejectedValueOnce(errorFake as never)
      const hash = 'hashed_value'
      const value = 'any_value'

      const result = await sut.compare(hash, value)

      expect(result.isLeft()).toBeTruthy()
    })

    it('returns an error when argon.verify throws', async () => {
      const { sut, errorFake } = makeSut()
      jest.spyOn(argon2id, 'verify').mockRejectedValueOnce(errorFake as never)
      const hash = 'hashed_value'
      const value = 'any_value'

      const result = await sut.compare(hash, value)

      expect(result.value).toBeInstanceOf(DomainError)
    })
  })
})
