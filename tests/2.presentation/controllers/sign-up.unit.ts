import CreateUserUseCase from '@/1.application/use-cases/create-user'
import SignUpController from '@/2.presentation/controllers/sign-up'
import ServerError from '@/2.presentation/errors/server'
import { clientError } from '@/2.presentation/helpers/http-response'
import Validator from '@/2.presentation/interfaces/validator'
import { HttpRequest } from '@/2.presentation/types/http-types'
import { makeCreateUserUseCaseStub } from '~/2.presentation/stubs/create-user-use-case.stub'
import { makeValidatorStub } from '~/2.presentation/stubs/validator.stub'

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
  createUserUseCase: CreateUserUseCase
}

const makeSut = (): SutTypes => {
  const injection = {
    validator: makeValidatorStub(),
    createUserUseCase: makeCreateUserUseCaseStub() as unknown as CreateUserUseCase
  }
  const sut = new SignUpController(injection)

  return { sut, ...injection }
}

describe('SignUp Controller', () => {
  it('should call CreateUser with correct values', async () => {
    const { sut, createUserUseCase } = makeSut()
    const addSpy = jest.spyOn(createUserUseCase, 'execute')
    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 if CreateUser throws', async () => {
    const { sut, createUserUseCase } = makeSut()
    jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(new Error())
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
