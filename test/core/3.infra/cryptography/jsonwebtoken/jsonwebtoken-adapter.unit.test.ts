import 'dotenv/config'

import jwt from 'jsonwebtoken'

import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type TokenData, TokenType } from '@/core/1.application/cryptography/encrypter'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { JsonwebtokenAdapter } from '@/core/3.infra/cryptography/jsonwebtoken/jsonwebtoken-adapter'

import { makeErrorFake } from '~/core/fakes/error-fake'

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: () => 'token',
    verify: () => ({
      payload: {
        auth: ['any_auth'],
        id: 'any_id'
      },
      type: TokenType.access
    })
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
    it('calls jwt.sign with correct params', async () => {
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

    it('returns Right with token when encrypt succeeds', async () => {
      const { sut, dataFake } = makeSut()

      const result = await sut.encrypt(dataFake)

      expect(result.isRight()).toBe(true)
      expect(result.value).toBe('token')
    })

    it('calls jwt.verify with correct params', async () => {
      const { sut } = makeSut()
      const verifySpy = vi.spyOn(vi.mocked(jwt), 'verify')
      const token = 'token'

      await sut.decrypt(token)

      expect(verifySpy).toHaveBeenCalledWith('token', 'any_secret')
    })

    it('returns Right with decrypted token when decrypt succeeds', async () => {
      const { sut } = makeSut()
      const token = 'token'

      const result = await sut.decrypt(token)

      expect(result.isRight()).toBe(true)
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
    it('returns Left with ServerError when jsonwebtoken.encrypt throws', async () => {
      const { sut, errorFake, dataFake } = makeSut()
      vi.spyOn(jwt, 'sign').mockRejectedValueOnce(errorFake as never)

      const result = await sut.encrypt(dataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when jsonwebtoken.verify throws', async () => {
      const { sut, errorFake } = makeSut()
      vi.spyOn(jwt, 'verify').mockRejectedValueOnce(errorFake as never)
      const token = 'any_token'

      const result = await sut.decrypt(token)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })
  })
})
