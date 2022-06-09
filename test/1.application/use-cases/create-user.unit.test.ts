import faker from 'faker'

import User from '@/0.domain/entities/user'
import { Either, left, right } from '@/0.domain/utils/either'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import Hasher from '@/1.application/interfaces/hasher'
import { UserData } from '@/1.application/types/user-data'
import CreateUserUseCase from '@/1.application/use-cases/create-user'

const makeUserDataFake = (): UserData => ({
  email: faker.internet.email(),
  name: faker.internet.userName(),
  password: faker.internet.password()
})

const makeHasherStub = (): Hasher => ({
  hash: jest.fn(async (): Promise<Either<Error, string>> => {
    return right(faker.random.alphaNumeric(32))
  })
})

const makeCreateUserRepositoryStub = (): CreateUserRepository => ({
  create: jest.fn(async (): Promise<Either<Error, User>> => {
    return right(User.create({
      id: faker.datatype.uuid(),
      ...makeUserDataFake()
    }).value as User)
  })
})

type SutTypes = {
  sut: CreateUserUseCase
  hasher: Hasher
  createUserRepository: CreateUserRepository
}

const makeSut = (): SutTypes => {
  const injection = {
    hasher: makeHasherStub(),
    createUserRepository: makeCreateUserRepositoryStub()
  }
  const sut = new CreateUserUseCase(injection)

  return { sut, ...injection }
}

describe('CreateUserUseCase', () => {
  describe('success', () => {
    it('calls Hasher with correct param', async () => {
      const { sut, hasher } = makeSut()
      const userData = makeUserDataFake()

      await sut.execute(userData)

      expect(hasher.hash).toHaveBeenCalledWith(userData.password)
    })

    it('calls CreateUserRepository with correct params', async () => {
      const { sut, hasher, createUserRepository } = makeSut()
      const hashedPassword = 'hashed_password'
      const userData = makeUserDataFake()
      jest.spyOn(hasher, 'hash').mockResolvedValueOnce(right(hashedPassword))

      await sut.execute(userData)

      expect(createUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword
      })
    })

    it('returns an User', async () => {
      const { sut } = makeSut()
      const userData = makeUserDataFake()

      const user = await sut.execute(userData)

      expect(user.value).toBeInstanceOf(User)
    })
  })

  describe('failure', () => {
    it('returns an Error if Hasher fails', async () => {
      const { sut, hasher } = makeSut()
      jest.spyOn(hasher, 'hash').mockResolvedValueOnce(left(new Error()))

      const promise = sut.execute(makeUserDataFake())

      await expect(promise).resolves.toHaveProperty('value', new Error())
    })

    it('returns an Error if CreateUserRepository fails', async () => {
      const { sut, createUserRepository } = makeSut()
      jest.spyOn(createUserRepository, 'create').mockResolvedValueOnce(left(new Error()))

      const promise = sut.execute(makeUserDataFake())

      await expect(promise).resolves.toHaveProperty('value', new Error())
    })
  })
})
