import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'
import { type Encrypter, TokenType } from '@/core/1.application/cryptography/encrypter'
import { AuthMiddleware } from '@/core/3.infra/api/middlewares/auth-middleware'

import { makeErrorFake } from '~/core/fakes/error-fake'

const makeEncrypterStub = (): Encrypter => ({
  decrypt: vi.fn(async (): Promise<Either<DomainError, any>> => right({
    payload: { auth: ['any_role'] },
    type: TokenType.access
  })),
  encrypt: vi.fn(async (): Promise<Either<DomainError, string>> => right('token'))
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
    errorFake: makeErrorFake(),
    role: 'any_role'
  }

  const sut = AuthMiddleware.create(params)

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
        auth: [],
        payload: { anyKey: 'any_value' }
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
        auth: ['any_role'],
        payload: { anyKey: 'any_value' }
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
        auth: ['any'],
        payload: { anyKey: 'any_value' }
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
        auth: ['any'],
        payload: { anyKey: 'any_value' }
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
        auth: ['any'],
        payload: { anyKey: 'any_value' }
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
        auth: ['any'],
        payload: { anyKey: 'any_value' }
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
        auth: ['any'],
        payload: { anyKey: 'any_value' }
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
