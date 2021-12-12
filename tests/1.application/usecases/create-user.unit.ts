import faker from 'faker'

import User from '@/0.domain/entities/user'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import { Hasher } from '@/1.application/interfaces/hasher'
import CreateUserUsecase from '@/1.application/usecases/create-user'
import { CreateUserRepositoryStub } from '~/1.application/mocks/create-user-repository.mock'
import HasherStub from '~/1.application/mocks/hasher.mock'
import mockUserData from '~/1.application/mocks/user-data.mock'

type SutTypes = {
  sut: CreateUserUsecase
  hasher: Hasher
  createUserRepository: CreateUserRepository
}

const makeSut = (): SutTypes => {
  const injection = {
    hasher: new HasherStub(),
    createUserRepository: new CreateUserRepositoryStub()
  }
  const sut = new CreateUserUsecase(injection)

  return { sut, ...injection }
}

describe('CreateUser Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasher } = makeSut()
    const hasherSpy = jest.spyOn(hasher, 'hash')
    const userData = mockUserData()
    await sut.create(userData)

    expect(hasherSpy).toHaveBeenCalledWith(userData.password)
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasher } = makeSut()
    jest.spyOn(hasher, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.create(mockUserData())

    await expect(promise).rejects.toThrowError()
  })

  it('should call AddUserRepository with correct values', async () => {
    const { sut, hasher, createUserRepository } = makeSut()
    const addSpy = jest.spyOn(createUserRepository, 'create')
    const userData = mockUserData()
    const hashedPassword = faker.random.alphaNumeric(32)
    jest.spyOn(hasher, 'hash').mockResolvedValueOnce(hashedPassword)
    const userDataWithHashedPassoword = { ...userData, password: hashedPassword }
    await sut.create(userData)

    expect(addSpy).toHaveBeenCalledWith(userDataWithHashedPassoword)
  })

  it('should throw if AddUserRepository throws', async () => {
    const { sut, createUserRepository } = makeSut()
    jest.spyOn(createUserRepository, 'create').mockRejectedValueOnce(new Error())
    const promise = sut.create(mockUserData())

    await expect(promise).rejects.toThrowError()
  })

  it('should return an user on success', async () => {
    const { sut, hasher, createUserRepository } = makeSut()
    const userData = mockUserData()
    const hashedPassword = faker.random.alphaNumeric(32)
    jest.spyOn(hasher, 'hash').mockResolvedValueOnce(hashedPassword)
    const id = faker.datatype.uuid()
    const createdUser = { ...userData, password: hashedPassword, id }
    jest.spyOn(createUserRepository, 'create').mockResolvedValueOnce(new User(createdUser))
    const user = await sut.create(userData)

    await expect(user.props).toEqual(createdUser)
  })
})
