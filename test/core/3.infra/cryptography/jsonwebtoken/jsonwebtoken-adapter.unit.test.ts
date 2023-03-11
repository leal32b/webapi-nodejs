import 'dotenv/config'

import jwt, { type JwtPayload } from 'jsonwebtoken'

import { DomainError } from '@/core/0.domain/base/domain-error'
import { type TokenData, TokenType } from '@/core/1.application/cryptography/encrypter'
import { JsonwebtokenAdapter } from '@/core/3.infra/cryptography/jsonwebtoken/jsonwebtoken-adapter'

import { makeErrorFake } from '~/core/fakes/error-fake'

vi.mock('jsonwebtoken', () => ({
  default: {
    async sign (): Promise<string> {
      return await Promise.resolve('token')
    },
    async verify (): Promise<JwtPayload> {
      return await Promise.resolve({
        payload: {
          auth: ['any_auth'],
          id: 'any_id'
        },
        type: TokenType.access
      })
    }
  }
}))

const makeFakeData = (): TokenData => ({
  payload: {
    auth: ['any_auth'],
    id: 'any_id'
  },
  type: TokenType.access
})

type SutTypes = {
  sut: JsonwebtokenAdapter
  errorFake: DomainError
  dataFake: TokenData
}

const makeSut = (): SutTypes => {
  const doubles = {
    dataFake: makeFakeData(),
    errorFake: makeErrorFake()
  }
  const sut = JsonwebtokenAdapter.create()

  return { sut, ...doubles }
}

describe('JsonwebtokenAdapter', () => {
  describe('success', () => {
    it('calls encrypt with correct params', async () => {
      const { sut, dataFake } = makeSut()
      const signSpy = vi.spyOn(vi.mocked(jwt), 'sign')

      await sut.encrypt(dataFake)

      expect(signSpy).toHaveBeenCalledWith({
        payload: {
          auth: ['any_auth'],
          id: 'any_id'
        },
        type: TokenType.access
      },
      'any_secret',
      {
        expiresIn: '1d'
      })
    })

    it('returns Right when encrypt succeeds', async () => {
      const { sut, dataFake } = makeSut()

      const result = await sut.encrypt(dataFake)

      expect(result.isRight()).toBe(true)
    })

    it('returns a token', async () => {
      const { sut, dataFake } = makeSut()

      const result = await sut.encrypt(dataFake)

      expect(result.value).toBe('token')
    })

    it('returns Right when decrypt succeeds', async () => {
      const { sut } = makeSut()
      const token = 'token'

      const result = await sut.decrypt(token)

      expect(result.isRight()).toBe(true)
    })

    it('decrypts a token', async () => {
      const { sut } = makeSut()
      const token = 'token'

      const result = await sut.decrypt(token)

      expect(result.value).toEqual({
        payload: {
          auth: ['any_auth'],
          id: 'any_id'
        },
        type: TokenType.access
      })
    })
  })

  describe('failure', () => {
    it('returns Left when jsonwebtoken.encrypt throws', async () => {
      const { sut, errorFake, dataFake } = makeSut()
      vi.spyOn(jwt, 'sign').mockRejectedValueOnce(errorFake as never)

      const result = await sut.encrypt(dataFake)

      expect(result.isLeft()).toBe(true)
    })

    it('returns an error when jsonwebtoken.encrypt throws', async () => {
      const { sut, errorFake, dataFake } = makeSut()
      vi.spyOn(jwt, 'sign').mockRejectedValueOnce(errorFake as never)

      const result = await sut.encrypt(dataFake)

      expect(result.value).toBeInstanceOf(DomainError)
    })

    it('returns Left when jsonwebtoken.verify throws', async () => {
      const { sut, errorFake } = makeSut()
      vi.spyOn(jwt, 'verify').mockRejectedValueOnce(errorFake as never)
      const token = 'any_token'

      const result = await sut.decrypt(token)

      expect(result.isLeft()).toBe(true)
    })

    it('returns an error when jsonwebtoken.verify throws', async () => {
      const { sut, errorFake } = makeSut()
      vi.spyOn(jwt, 'verify').mockRejectedValueOnce(errorFake as never)
      const token = 'any_token'

      const result = await sut.decrypt(token)

      expect(result.value).toBeInstanceOf(DomainError)
    })
  })
})
