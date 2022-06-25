import DomainError from '@/0.domain/base/domain-error'
import User from '@/0.domain/entities/user'
import { Either, left, right } from '@/0.domain/utils/either'
import InvalidPasswordError from '@/1.application/errors/invalid-password'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import Hasher from '@/1.application/interfaces/hasher'
import { CreateUserData } from '@/1.application/types/create-user-data'
import CreateUserUseCase from '@/1.application/use-cases/create-user'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeCreateUserDataFake = (): CreateUserData => ({
  email: 'any@mail.com',
  name: 'any_name',
  password: 'any_password',
  passwordRetype: 'any_password'
})

const makeHasherStub = (): Hasher => ({
  hash: jest.fn(async (): Promise<Either<DomainError, string>> => {
    return right('hashed_password')
  })
})

const makeCreateUserRepositoryStub = (): CreateUserRepository => ({
  create: jest.fn(async (): Promise<Either<DomainError, User>> => {
    return right(User.create({
      id: 'any_id',
      ...makeCreateUserDataFake()
    }).value as User)
  })
})

type SutTypes = {
  sut: CreateUserUseCase
  hasher: Hasher
  createUserRepository: CreateUserRepository
  errorFake: DomainError
  createUserDataFake: CreateUserData
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake(),
    createUserDataFake: makeCreateUserDataFake()
  }
  const injection = {
    hasher: makeHasherStub(),
    createUserRepository: makeCreateUserRepositoryStub()
  }
  const sut = new CreateUserUseCase(injection)

  return { sut, ...injection, ...fakes }
}

describe('CreateUserUseCase', () => {
  describe('success', () => {
    it('calls Hasher with correct param', async () => {
      const { sut, hasher, createUserDataFake } = makeSut()

      await sut.execute(createUserDataFake)

      expect(hasher.hash).toHaveBeenCalledWith(createUserDataFake.password)
    })

    it('calls CreateUserRepository with correct params', async () => {
      const { sut, createUserRepository, createUserDataFake } = makeSut()

      await sut.execute(createUserDataFake)

      expect(createUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            id: expect.any(Object),
            email: expect.any(Object),
            name: expect.any(Object),
            password: expect.any(Object)
          }
        })
      )
    })

    it('returns an User', async () => {
      const { sut, createUserDataFake } = makeSut()

      const user = await sut.execute(createUserDataFake)

      expect(user.value).toBeInstanceOf(User)
    })
  })

  describe('failure', () => {
    it('returns InvalidPasswordError when passwords do not match', async () => {
      const { sut, createUserDataFake } = makeSut()

      const result = await sut.execute({ ...createUserDataFake, passwordRetype: 'anything' })

      expect(result.value[0]).toBeInstanceOf(InvalidPasswordError)
    })

    it('returns an Error when Hasher fails', async () => {
      const { sut, hasher, errorFake, createUserDataFake } = makeSut()
      jest.spyOn(hasher, 'hash').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(createUserDataFake)

      expect(result.value[0]).toEqual(errorFake)
    })

    it('returns an Error when User.create fails', async () => {
      const { sut, createUserDataFake } = makeSut()

      const result = await sut.execute({ ...createUserDataFake, email: 'invalid_email' })

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an Error when CreateUserRepository fails', async () => {
      const { sut, createUserRepository, errorFake, createUserDataFake } = makeSut()
      jest.spyOn(createUserRepository, 'create').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(createUserDataFake)

      expect(result.value[0]).toEqual(errorFake)
    })
  })
})
