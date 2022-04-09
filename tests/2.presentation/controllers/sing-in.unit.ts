import AuthenticateUserUseCase from '@/1.application/use-cases/authenticate-user'
import SignInController from '@/2.presentation/controllers/sign-in'
import { clientError, serverError, success } from '@/2.presentation/helpers/http-response'
import Validator from '@/2.presentation/interfaces/validator'
import { HttpRequest } from '@/2.presentation/types/http-types'
import { makeAuthenticateUserUseCaseStub } from '~/2.presentation/stubs/authenticate-user.stub'
import { makeValidatorStub } from '~/2.presentation/stubs/validator.stub'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

type SutTypes = {
  sut: SignInController
  validator: Validator
  authenticateUserUseCase: AuthenticateUserUseCase
}

const makeSut = (): SutTypes => {
  const injection = {
    validator: makeValidatorStub(),
    authenticateUserUseCase: makeAuthenticateUserUseCaseStub() as any
  }
  const sut = new SignInController(injection)

  return { sut, ...injection }
}

describe('SignIn Controller', () => {
  describe('exceptions', () => {
    it('should return 401 if invalid credentials are provided', async () => {
      const { sut, authenticateUserUseCase } = makeSut()
      jest.spyOn(authenticateUserUseCase, 'execute').mockReturnValueOnce(Promise.resolve(null))
      const httpResponse = await sut.handle(makeFakeRequest())

      expect(httpResponse).toEqual(clientError.unauthorized())
    })

    it('should return 400 if Validator returns an error', async () => {
      const { sut, validator } = makeSut()
      jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
      const httpResponse = await sut.handle(makeFakeRequest())

      expect(httpResponse).toEqual(clientError.badRequest(new Error()))
    })

    it('should return 500 if AuthenticateUserUseCase throws', async () => {
      const { sut, authenticateUserUseCase } = makeSut()
      jest.spyOn(authenticateUserUseCase, 'execute').mockReturnValueOnce(Promise.reject(new Error()))
      const httpResponse = await sut.handle(makeFakeRequest())

      expect(httpResponse).toEqual(serverError.internalServerError(new Error()))
    })
  })

  describe('success', () => {
    it('should call Validator with correct value', async () => {
      const { sut, validator } = makeSut()
      const validateSpy = jest.spyOn(validator, 'validate')
      const httpRequest = makeFakeRequest()
      await sut.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should call AuthenticateUserUseCase with correct values', async () => {
      const { sut, authenticateUserUseCase } = makeSut()
      const authSpy = jest.spyOn(authenticateUserUseCase, 'execute')
      await sut.handle(makeFakeRequest())

      expect(authSpy).toHaveBeenCalledWith({
        email: 'any_email@email.com',
        password: 'any_password'
      })
    })

    it('should return 200 if valid credentials are provided', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(makeFakeRequest())

      expect(httpResponse).toEqual(success.ok({ accessToken: 'any_token' }))
    })
  })
})
