import CreateUserUsecase from '@/1.application/usecases/create-user'
import SignUpController from '@/2.adapter/controllers/sign-up'
import ServerError from '@/2.adapter/errors/server'
import { clientError } from '@/2.adapter/helpers/http-response'
import Validator from '@/2.adapter/interfaces/validator'
import { HttpRequest } from '@/2.adapter/types/http-types'
import { makeCreateUserUsecaseStub } from '~/2.adapter/stubs/create-user-usecase.stub'
import { makeValidatorStub } from '~/2.adapter/stubs/validator.stub'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

type SutTypes = {
  sut: SignUpController
  validator: Validator
  createUserUsecase: CreateUserUsecase
}

const makeSut = (): SutTypes => {
  const injection = {
    validator: makeValidatorStub(),
    createUserUsecase: makeCreateUserUsecaseStub() as unknown as CreateUserUsecase
  }
  const sut = new SignUpController(injection)

  return { sut, ...injection }
}

describe('SignUp Controller', () => {
  it('should call CreateUser with correct values', async () => {
    const { sut, createUserUsecase } = makeSut()
    const addSpy = jest.spyOn(createUserUsecase, 'execute')
    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 if CreateUser throws', async () => {
    const { sut, createUserUsecase } = makeSut()
    jest.spyOn(createUserUsecase, 'execute').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(null))
  })

  it('should call Validator with correct value', async () => {
    const { sut, validator } = makeSut()
    const validateSpy = jest.spyOn(validator, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validator returns an error', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(clientError.badRequest(new Error()))
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })
})
