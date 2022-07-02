import argon2id from 'argon2'

import DomainError from '@/0.domain/base/domain-error'
import ArgonAdapter from '@/3.infra/cryptography/argon'

jest.mock('argon2', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashed_value')
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

    it('returns Right on success', async () => {
      const { sut } = makeSut()

      const result = await sut.hash('any_value')

      expect(result.isRight()).toBeTruthy()
    })

    it('returns a hash on success', async () => {
      const { sut } = makeSut()

      const result = await sut.hash('any_value')

      expect(result.value).toBe('hashed_value')
    })
  })

  describe('failure', () => {
    it('returns Left when bcrypt throws', async () => {
      const { sut, errorFake } = makeSut()
      jest.spyOn(argon2id, 'hash').mockRejectedValueOnce(errorFake as never)

      const result = await sut.hash('any_value')

      expect(result.isLeft()).toBeTruthy()
    })

    it('returns an error when bcrypt throws', async () => {
      const { sut, errorFake } = makeSut()
      jest.spyOn(argon2id, 'hash').mockRejectedValueOnce(errorFake as never)

      const result = await sut.hash('any_value')

      expect(result.value).toBeInstanceOf(DomainError)
    })
  })
})
