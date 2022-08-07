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
  encrypt: jest.fn(async (): Promise<Either<DomainError, string>> => {
    return right('token')
  }),
  decrypt: jest.fn(async (): Promise<Either<DomainError, any>> => {
    return right({
      type: TokenType.access,
      payload: {
        anyKey: 'any_value'
      }
    })
  })
})

type SutTypes = {
  sut: AuthMiddleware
  encrypter: Encrypter
  role: string
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const injection = {
    encrypter: makeEncrypterStub(),
    role: 'any_role',
    errorFake: makeErrorFake()
  }

  const sut = new AuthMiddleware(injection)

  return { sut, ...injection }
}

describe('AuthMiddleware', () => {
  describe('success', () => {
    it('returns payload and statusCode 200 when token is valid', async () => {
      const { sut } = makeSut()
      const fakeRequest = {
        accessToken: 'any_token',
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
    it('returns error and statusCode 401 when token is invalid', async () => {
      const { sut, encrypter, errorFake } = makeSut()
      jest.spyOn(encrypter, 'decrypt').mockResolvedValueOnce(left(errorFake))
      const fakeRequest = {
        accessToken: 'invalid_token',
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.handle(fakeRequest)

      expect(result).toEqual({
        payload: expect.any(DomainError),
        statusCode: 401
      })
    })
  })
})
