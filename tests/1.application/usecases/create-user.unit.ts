import faker from 'faker'

import User from '@/0.domain/entities/user'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import Hasher from '@/1.application/interfaces/hasher'
import { UserData } from '@/1.application/types/user-types'
import CreateUserUsecase from '@/1.application/usecases/create-user'
import { makeCreateUserRepositoryStub } from '~/1.application/stubs/create-user-repository.stub'
import { makeHasherStub } from '~/1.application/stubs/hasher.stub'

const makeFakeUserData = (): UserData => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

type SutTypes = {
  sut: CreateUserUsecase
  hasher: Hasher
  createUserRepository: CreateUserRepository
}

const makeSut = (): SutTypes => {
  const injection = {
    hasher: makeHasherStub(),
    createUserRepository: makeCreateUserRepositoryStub()
  }
  const sut = new CreateUserUsecase(injection)

  return { sut, ...injection }
}

describe('CreateUser Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasher } = makeSut()
    const hasherSpy = jest.spyOn(hasher, 'hash')
    const userData = makeFakeUserData()
    await sut.execute(userData)

    expect(hasherSpy).toHaveBeenCalledWith(userData.password)
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasher } = makeSut()
    jest.spyOn(hasher, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.execute(makeFakeUserData())

    await expect(promise).rejects.toThrowError()
  })

  it('should call AddUserRepository with correct values', async () => {
    const { sut, hasher, createUserRepository } = makeSut()
    const addSpy = jest.spyOn(createUserRepository, 'create')
    const userData = makeFakeUserData()
    const hashedPassword = faker.random.alphaNumeric(32)
    const userDataWithHashedPassoword = { ...userData, password: hashedPassword }
    jest.spyOn(hasher, 'hash').mockResolvedValueOnce(hashedPassword)
    await sut.execute(userData)

    expect(addSpy).toHaveBeenCalledWith(userDataWithHashedPassoword)
  })

  it('should throw if AddUserRepository throws', async () => {
    const { sut, createUserRepository } = makeSut()
    jest.spyOn(createUserRepository, 'create').mockRejectedValueOnce(new Error())
    const promise = sut.execute(makeFakeUserData())

    await expect(promise).rejects.toThrowError()
  })

  it('should return an user on success', async () => {
    const { sut, hasher, createUserRepository } = makeSut()
    const userData = makeFakeUserData()
    const hashedPassword = faker.random.alphaNumeric(32)
    const id = faker.datatype.uuid()
    const createdUser = { ...userData, password: hashedPassword, id }
    jest.spyOn(hasher, 'hash').mockResolvedValueOnce(hashedPassword)
    jest.spyOn(createUserRepository, 'create').mockResolvedValueOnce(new User(createdUser))
    const user = await sut.execute(userData)

    await expect(user.props).toEqual(createdUser)
  })
})
