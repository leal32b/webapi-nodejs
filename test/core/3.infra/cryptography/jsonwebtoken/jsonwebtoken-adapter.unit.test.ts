import 'dotenv/config'

import jwt, { JwtPayload } from 'jsonwebtoken'

import { DomainError } from '@/core/0.domain/base/domain-error'
import { TokenData, TokenType } from '@/core/1.application/cryptography/encrypter'
import { JsonwebtokenAdapter } from '@/core/3.infra/cryptography/jsonwebtoken/jsonwebtoken-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('token')
  },
  async verify (): Promise<JwtPayload> {
    return await Promise.resolve({
      type: TokenType.access,
      payload: {
        id: 'any_id',
        auth: ['any_auth']
      }
    })
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

const makeFakeData = (): TokenData => ({
  type: TokenType.access,
  payload: {
    id: 'any_id',
    auth: ['any_auth']
  }
})

type SutTypes = {
  sut: JsonwebtokenAdapter
  errorFake: DomainError
  dataFake: TokenData
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    dataFake: makeFakeData()
  }
  const sut = new JsonwebtokenAdapter()

  return { sut, ...doubles }
}

describe('JsonwebtokenAdapter', () => {
  describe('success', () => {
    it('calls encrypt with correct params', async () => {
      const { sut, dataFake } = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt(dataFake)

      expect(signSpy).toHaveBeenCalledWith({
        type: TokenType.access,
        payload: {
          id: 'any_id',
          auth: ['any_auth']
        }
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
        type: TokenType.access,
        payload: {
          id: 'any_id',
          auth: ['any_auth']
        }
      })
    })
  })

  describe('failure', () => {
    it('returns Left when jsonwebtoken.encrypt throws', async () => {
      const { sut, errorFake, dataFake } = makeSut()
      jest.spyOn(jwt, 'sign').mockRejectedValueOnce(errorFake as never)

      const result = await sut.encrypt(dataFake)

      expect(result.isLeft()).toBe(true)
    })

    it('returns an error when jsonwebtoken.encrypt throws', async () => {
      const { sut, errorFake, dataFake } = makeSut()
      jest.spyOn(jwt, 'sign').mockRejectedValueOnce(errorFake as never)

      const result = await sut.encrypt(dataFake)

      expect(result.value).toBeInstanceOf(DomainError)
    })

    it('returns Left when jsonwebtoken.verify throws', async () => {
      const { sut, errorFake } = makeSut()
      jest.spyOn(jwt, 'verify').mockRejectedValueOnce(errorFake as never)
      const token = 'any_token'

      const result = await sut.decrypt(token)

      expect(result.isLeft()).toBe(true)
    })

    it('returns an error when jsonwebtoken.verify throws', async () => {
      const { sut, errorFake } = makeSut()
      jest.spyOn(jwt, 'verify').mockRejectedValueOnce(errorFake as never)
      const token = 'any_token'

      const result = await sut.decrypt(token)

      expect(result.value).toBeInstanceOf(DomainError)
    })
  })
})
