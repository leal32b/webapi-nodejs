import DomainError from '@/0.domain/base/domain-error'
import User from '@/0.domain/entities/user'
import { Either, left, right } from '@/0.domain/utils/either'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import Hasher from '@/1.application/interfaces/hasher'
import { UserData } from '@/1.application/types/user-data'
import CreateUserUseCase from '@/1.application/use-cases/create-user'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeUserDataFake = (): UserData => ({
  email: 'any@mail.com',
  name: 'any_name',
  password: 'any_password'
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
      ...makeUserDataFake()
    }).value as User)
  })
})

type SutTypes = {
  sut: CreateUserUseCase
  hasher: Hasher
  createUserRepository: CreateUserRepository
  errorFake: DomainError
  userDataFake: UserData
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake(),
    userDataFake: makeUserDataFake()
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
      const { sut, hasher, userDataFake } = makeSut()

      await sut.execute(userDataFake)

      expect(hasher.hash).toHaveBeenCalledWith(userDataFake.password)
    })

    it('calls CreateUserRepository with correct params', async () => {
      const { sut, createUserRepository, userDataFake } = makeSut()

      await sut.execute(userDataFake)

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
      const { sut, userDataFake } = makeSut()

      const user = await sut.execute(userDataFake)

      expect(user.value).toBeInstanceOf(User)
    })
  })

  describe('failure', () => {
    it('returns an Error when Hasher fails', async () => {
      const { sut, hasher, errorFake } = makeSut()
      jest.spyOn(hasher, 'hash').mockResolvedValueOnce(left(errorFake))

      const promise = sut.execute(makeUserDataFake())

      await expect(promise).resolves.toEqual(left([errorFake]))
    })

    it('returns an Error when CreateUserRepository fails', async () => {
      const { sut, createUserRepository, errorFake } = makeSut()
      jest.spyOn(createUserRepository, 'create').mockResolvedValueOnce(left(errorFake))

      const promise = sut.execute(makeUserDataFake())

      await expect(promise).resolves.toEqual(left([errorFake]))
    })
  })
})
