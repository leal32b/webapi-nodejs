import AuthenticateUserUsecase from '@/1.application/usecases/authenticate-user'
import SignInController from '@/2.adapter/controllers/sign-in'
import { clientError, serverError, success } from '@/2.adapter/helpers/http-response'
import Validator from '@/2.adapter/interfaces/validator'
import { HttpRequest } from '@/2.adapter/types/http-types'
import { makeAuthenticateUserUsecaseStub } from '~/2.adapter/stubs/authenticate-user.stub'
import { makeValidatorStub } from '~/2.adapter/stubs/validator.stub'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

type SutTypes = {
  sut: SignInController
  validator: Validator
  authenticateUserUsecase: AuthenticateUserUsecase
}

const makeSut = (): SutTypes => {
  const injection = {
    validator: makeValidatorStub(),
    authenticateUserUsecase: makeAuthenticateUserUsecaseStub()
  }
  const sut = new SignInController(injection)

  return { sut, ...injection }
}

describe('SignIn Controller', () => {
  describe('exceptions', () => {
    it('should return 401 if invalid credentials are provided', async () => {
      const { sut, authenticateUserUsecase } = makeSut()
      jest.spyOn(authenticateUserUsecase, 'execute').mockReturnValueOnce(Promise.resolve(null))
      const httpResponse = await sut.handle(makeFakeRequest())

      expect(httpResponse).toEqual(clientError.unauthorized())
    })

    it('should return 400 if Validator returns an error', async () => {
      const { sut, validator } = makeSut()
      jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
      const httpResponse = await sut.handle(makeFakeRequest())

      expect(httpResponse).toEqual(clientError.badRequest(new Error()))
    })

    it('should return 500 if AuthenticateUserUsecase throws', async () => {
      const { sut, authenticateUserUsecase } = makeSut()
      jest.spyOn(authenticateUserUsecase, 'execute').mockReturnValueOnce(Promise.reject(new Error()))
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

    it('should call AuthenticateUserUsecase with correct values', async () => {
      const { sut, authenticateUserUsecase } = makeSut()
      const authSpy = jest.spyOn(authenticateUserUsecase, 'execute')
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
