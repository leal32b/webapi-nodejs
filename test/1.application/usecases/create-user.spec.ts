import { CreateUserModel } from '@/0.domain/interfaces/create-user'
import { UserModel } from '@/0.domain/models/user'
import { CreateUserRepository } from '@/1.application/interfaces/create-user-repository'
import { Encrypter } from '@/1.application/interfaces/encryter'
import { CreateUserUsecase } from '@/1.application/usecases/create-user'

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  return new EncrypterStub()
}

const makeCreateUserRepositoryStub = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    async create (userData: CreateUserModel): Promise<UserModel> {
      const fakeUser = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }
      return await Promise.resolve(fakeUser)
    }
  }

  return new CreateUserRepositoryStub()
}

interface SutTypes {
  sut: CreateUserUsecase
  encrypterStub: Encrypter
  createUserRepositoryStub: CreateUserRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const createUserRepositoryStub = makeCreateUserRepositoryStub()
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
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const userData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.create(userData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const userData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.create(userData)

    await expect(promise).rejects.toThrowError()
  })

  it('should call AddUserRepository with correct values', async () => {
    const { sut, createUserRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(createUserRepositoryStub, 'create')
    const userData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.create(userData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  it('should throw if AddUserRepository throws', async () => {
    const { sut, createUserRepositoryStub } = makeSut()
    jest.spyOn(createUserRepositoryStub, 'create').mockRejectedValueOnce(new Error())
    const userData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.create(userData)

    await expect(promise).rejects.toThrowError()
  })

  it('should return an user on success', async () => {
    const { sut } = makeSut()
    const userData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const user = await sut.create(userData)

    await expect(user).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})
