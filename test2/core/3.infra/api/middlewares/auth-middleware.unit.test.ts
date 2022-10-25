import { vi } from 'vitest'

import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { Encrypter, TokenType } from '@/core/1.application/cryptography/encrypter'
import { AuthMiddleware } from '@/core/3.infra/api/middlewares/auth-middleware'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeEncrypterStub = (): Encrypter => ({
  encrypt: vi.fn(async (): Promise<Either<DomainError, string>> => right('token')),
  decrypt: vi.fn(async (): Promise<Either<DomainError, any>> => right({
    type: TokenType.access,
    payload: {
      auth: ['any_role']
    }
  }))
})

type SutTypes = {
  sut: AuthMiddleware
  encrypter: Encrypter
  role: string
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const params = {
    encrypter: makeEncrypterStub(),
    role: 'any_role',
    errorFake: makeErrorFake()
  }

  const sut = new AuthMiddleware(params)

  return { sut, ...params }
}

describe('AuthMiddleware', () => {
  describe('success', () => {
    it('returns payload and statusCode 200 when there is no auth', async () => {
      const { sut } = makeSut()
      const fakeRequest = {
        accessToken: 'Bearer any_token',
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: { anyKey: 'any_value' },
        statusCode: 200
      })
    })

    it('returns payload and statusCode 200 when auth is empty', async () => {
      const { sut } = makeSut()
      const fakeRequest = {
        accessToken: 'Bearer any_token',
        payload: { anyKey: 'any_value' },
        auth: []
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: { anyKey: 'any_value' },
        statusCode: 200
      })
    })

    it('returns payload and statusCode 200 when token is valid', async () => {
      const { sut } = makeSut()
      const fakeRequest = {
        accessToken: 'Bearer any_token',
        payload: { anyKey: 'any_value' },
        auth: ['any_role']
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: { anyKey: 'any_value' },
        statusCode: 200
      })
    })
  })

  describe('failure', () => {
    it('returns error and statusCode 401 when encrypter.decrypt fails', async () => {
      const { sut, encrypter, errorFake } = makeSut()
      vi.spyOn(encrypter, 'decrypt').mockResolvedValueOnce(left(errorFake))
      const fakeRequest = {
        accessToken: 'Bearer invalid_token',
        payload: { anyKey: 'any_value' },
        auth: ['any']
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: {
          error: {
            message: 'token is invalid (type: Bearer)'
          }
        },
        statusCode: 401
      })
    })

    it('returns error and statusCode 401 when token type is invalid', async () => {
      const { sut } = makeSut()
      const fakeRequest = {
        accessToken: 'invalid_type any_token',
        payload: { anyKey: 'any_value' },
        auth: ['any']
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: {
          error: {
            message: 'token is invalid (type: Bearer)'
          }
        },
        statusCode: 401
      })
    })

    it('returns error and statusCode 401 when token value is null', async () => {
      const { sut } = makeSut()
      const fakeRequest = {
        accessToken: 'invalid_type',
        payload: { anyKey: 'any_value' },
        auth: ['any']
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: {
          error: {
            message: 'token is invalid (type: Bearer)'
          }
        },
        statusCode: 401
      })
    })

    it('returns error and statusCode 401 when token is null', async () => {
      const { sut } = makeSut()
      const fakeRequest = {
        accessToken: null,
        payload: { anyKey: 'any_value' },
        auth: ['any']
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: {
          error: {
            message: 'no Authorization token was provided'
          }
        },
        statusCode: 401
      })
    })

    it('returns error and statusCode 401 when any_role is not authorized', async () => {
      const { sut } = makeSut()
      const fakeRequest = {
        accessToken: 'Bearer any_token',
        payload: { anyKey: 'any_value' },
        auth: ['any']
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: {
          error: {
            message: 'user must have at least one of these permissions: any'
          }
        },
        statusCode: 401
      })
    })
  })
})
