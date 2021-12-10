import faker from 'faker'

import { CreateUserRepository } from '@/1.application/interfaces/create-user-repository'
import { Hasher } from '@/1.application/interfaces/hasher'
import { CreateUserUsecase } from '@/1.application/usecases/create-user'
import { CreateUserRepositoryStub } from '~/1.application/mocks/create-user-repository.mock'
import { HasherStub } from '~/1.application/mocks/hasher.mock'
import { mockUserData } from '~/1.application/mocks/user-data.mock'

type SutTypes = {
  sut: CreateUserUsecase
  hasherStub: Hasher
  createUserRepositoryStub: CreateUserRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = new HasherStub()
  const createUserRepositoryStub = new CreateUserRepositoryStub()
  const sut = new CreateUserUsecase(hasherStub, createUserRepositoryStub)

  return {
    sut,
    hasherStub,
    createUserRepositoryStub
  }
}

describe('CreateUser Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    const userData = mockUserData()
    await sut.create(userData)

    expect(hasherSpy).toHaveBeenCalledWith(userData.password)
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.create(mockUserData())

    await expect(promise).rejects.toThrowError()
  })

  it('should call AddUserRepository with correct values', async () => {
    const { sut, hasherStub, createUserRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(createUserRepositoryStub, 'create')
    const userData = mockUserData()
    const hashedPassword = faker.random.alphaNumeric(32)
    jest.spyOn(hasherStub, 'hash').mockResolvedValueOnce(hashedPassword)
    const userDataWithHashedPassoword = { ...userData, password: hashedPassword }
    await sut.create(userData)

    expect(addSpy).toHaveBeenCalledWith(userDataWithHashedPassoword)
  })

  it('should throw if AddUserRepository throws', async () => {
    const { sut, createUserRepositoryStub } = makeSut()
    jest.spyOn(createUserRepositoryStub, 'create').mockRejectedValueOnce(new Error())
    const promise = sut.create(mockUserData())

    await expect(promise).rejects.toThrowError()
  })

  it('should return an user on success', async () => {
    const { sut, hasherStub, createUserRepositoryStub } = makeSut()
    const userData = mockUserData()
    const hashedPassword = faker.random.alphaNumeric(32)
    jest.spyOn(hasherStub, 'hash').mockResolvedValueOnce(hashedPassword)
    const id = faker.datatype.uuid()
    const createdUser = { ...userData, password: hashedPassword, id }
    jest.spyOn(createUserRepositoryStub, 'create').mockResolvedValueOnce(createdUser)
    const user = await sut.create(userData)

    await expect(user).toEqual(createdUser)
  })
})
