import AuthenticateUserUsecase from '@/1.application/usecases/authenticate-user'
import SignInController from '@/2.adapter/controllers/sign-in'
import InvalidParamError from '@/2.adapter/errors/invalid-param-error'
import MissingParamError from '@/2.adapter/errors/missing-param-error'
import { clientError, serverError, success } from '@/2.adapter/helpers/http-response'
import ExtEmailValidator from '@/2.adapter/interfaces/ext-email-validator'
import { HttpRequest } from '@/2.adapter/types/http'
import { makeAuthenticateUserUsecaseStub } from '~/2.adapter/mocks/authenticate-user.mock'
import { makeExtEmailValidatorStub } from '~/2.adapter/mocks/email-validator.mock'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

type SutTypes = {
  sut: SignInController
  emailValidator: ExtEmailValidator
  authenticateUserUsecase: AuthenticateUserUsecase
}

const makeSut = (): SutTypes => {
  const injection = {
    emailValidator: makeExtEmailValidatorStub(),
    authenticateUserUsecase: makeAuthenticateUserUsecaseStub()
  }
  const sut = new SignInController(injection)

  return { sut, ...injection }
}

describe('SignIn Controller', () => {
  describe('params', () => {
    it('should return 400 if no email is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          password: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(clientError.badRequest(new MissingParamError('email')))
    })

    it('should return 400 if no password is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'any_email@email.com'
        }
      }
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(clientError.badRequest(new MissingParamError('password')))
    })

    it('should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidator } = makeSut()
      jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
      const httpResponse = await sut.handle(makeFakeRequest())

      expect(httpResponse).toEqual(clientError.badRequest(new InvalidParamError('email')))
    })
  })

  describe('EmailValidator', () => {
    it('should call EmailValidator with correct email', async () => {
      const { sut, emailValidator } = makeSut()
      const isValidSpy = jest.spyOn(emailValidator, 'isValid')
      await sut.handle(makeFakeRequest())

      expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    it('should return 500 if EmailValidator throws', async () => {
      const { sut, emailValidator } = makeSut()
      jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => { throw new Error() })
      const httpResponse = await sut.handle(makeFakeRequest())

      expect(httpResponse).toEqual(serverError.internalServerError(new Error()))
    })
  })

  describe('AuthenticateUserUsecase', () => {
    it('should call AuthenticateUserUsecase with correct values', async () => {
      const { sut, authenticateUserUsecase } = makeSut()
      const authSpy = jest.spyOn(authenticateUserUsecase, 'execute')
      await sut.handle(makeFakeRequest())

      expect(authSpy).toHaveBeenCalledWith({
        email: 'any_email@email.com',
        password: 'any_password'
      })
    })

    it('should return 401 if invalid credentials are provided', async () => {
      const { sut, authenticateUserUsecase } = makeSut()
      jest.spyOn(authenticateUserUsecase, 'execute').mockReturnValueOnce(Promise.resolve(null))
      const httpResponse = await sut.handle(makeFakeRequest())

      expect(httpResponse).toEqual(clientError.unauthorized())
    })

    it('should return 500 if AuthenticateUserUsecase throws', async () => {
      const { sut, authenticateUserUsecase } = makeSut()
      jest.spyOn(authenticateUserUsecase, 'execute').mockReturnValueOnce(Promise.reject(new Error()))
      const httpResponse = await sut.handle(makeFakeRequest())

      expect(httpResponse).toEqual(serverError.internalServerError(new Error()))
    })
  })

  describe('success', () => {
    it('should return 200 if valid credentials are provided', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(makeFakeRequest())

      expect(httpResponse).toEqual(success.ok({ accessToken: 'any_token' }))
    })
  })
})
