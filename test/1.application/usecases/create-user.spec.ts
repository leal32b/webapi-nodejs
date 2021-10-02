import { CreateUserRepository } from '@/1.application/interfaces/create-user-repository'
import { Encrypter } from '@/1.application/interfaces/encryter'
import { CreateUserUsecase } from '@/1.application/usecases/create-user'
import { CreateUserRepositoryStub } from '~/1.application/mocks/create-user-repository.mock'
import { EncrypterStub } from '~/1.application/mocks/encrypter.mock'
import { mockUserData } from '~/1.application/mocks/user-data.mock'
import faker from 'faker'

interface SutTypes {
  sut: CreateUserUsecase
  encrypterStub: Encrypter
  createUserRepositoryStub: CreateUserRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = new EncrypterStub()
  const createUserRepositoryStub = new CreateUserRepositoryStub()
  const sut = new CreateUserUsecase(encrypterStub, createUserRepositoryStub)

  return {
    sut,
    encrypterStub,
    createUserRepositoryStub
  }
}

describe('CreateUser Usecase', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    const userData = mockUserData()
    await sut.create(userData)

    expect(encrypterSpy).toHaveBeenCalledWith(userData.password)
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const userData = mockUserData()
    const promise = sut.create(userData)

    await expect(promise).rejects.toThrowError()
  })

  it('should call AddUserRepository with correct values', async () => {
    const { sut, encrypterStub, createUserRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(createUserRepositoryStub, 'create')
    const userData = mockUserData()
    const hashedPassword = faker.random.alphaNumeric(32)
    jest.spyOn(encrypterStub, 'encrypt').mockResolvedValueOnce(hashedPassword)
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
    const { sut, encrypterStub, createUserRepositoryStub } = makeSut()
    const userData = mockUserData()
    const hashedPassword = faker.random.alphaNumeric(32)
    jest.spyOn(encrypterStub, 'encrypt').mockResolvedValueOnce(hashedPassword)
    const id = faker.datatype.uuid()
    const createdUser = { ...userData, password: hashedPassword, id }
    jest.spyOn(createUserRepositoryStub, 'create').mockResolvedValueOnce(createdUser)
    const user = await sut.create(userData)

    await expect(user).toEqual(createdUser)
  })
})
