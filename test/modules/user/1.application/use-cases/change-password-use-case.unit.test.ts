import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { InvalidPasswordError } from '@/core/1.application/errors/invalid-password-error'
import { NotFoundError } from '@/core/1.application/errors/not-found-error'
import { UserAggregate } from '@/modules/user/0.domain/aggregates/user-aggregate'
import { UserRepository } from '@/modules/user/1.application/repositories/user-repository'
import { ChangePasswordData, ChangePasswordUseCase } from '@/modules/user/1.application/use-cases/change-password-use-case'

const fakeAggregate = UserAggregate.create({
  email: 'any@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'hashed_password',
  token: 'any_token'
}).value as UserAggregate

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeChangePasswordDataFake = (): ChangePasswordData => ({
  id: 'any_id',
  password: 'any_password',
  passwordRetype: 'any_password'
})

const makeUserRepositoryStub = (): UserRepository => ({
  create: jest.fn(async (): Promise<Either<DomainError[], void>> => {
    return right(null)
  }),
  readById: jest.fn(async (): Promise<Either<DomainError[], UserAggregate>> => {
    return right(fakeAggregate)
  }),
  readByEmail: jest.fn(async (): Promise<Either<DomainError[], UserAggregate>> => {
    return right(null)
  }),
  update: jest.fn(async (): Promise<Either<DomainError[], void>> => {
    return right(null)
  })
})

const makeHasherStub = (): Hasher => ({
  hash: jest.fn(async (): Promise<Either<DomainError, string>> => {
    return right('hashed_password')
  }),
  compare: jest.fn(async (): Promise<Either<DomainError, boolean>> => {
    return right(true)
  })
})

type SutTypes = {
  sut: ChangePasswordUseCase
  userRepository: UserRepository
  hasher: Hasher
  errorFake: DomainError
  changePasswordDataFake: ChangePasswordData
}

const makeSut = (): SutTypes => {
  const fakes = {
    changePasswordDataFake: makeChangePasswordDataFake(),
    errorFake: makeErrorFake()
  }
  const injection = {
    userRepository: makeUserRepositoryStub(),
    hasher: makeHasherStub()
  }
  const sut = new ChangePasswordUseCase(injection)

  return { sut, ...injection, ...fakes }
}

describe('AuthenticateUserUseCase', () => {
  describe('success', () => {
    it('calls UserRepository.readById with correct param', async () => {
      const { sut, userRepository, changePasswordDataFake } = makeSut()

      await sut.execute(changePasswordDataFake)

      expect(userRepository.readById).toHaveBeenCalledWith('any_id')
    })

    it('calls Hasher.hash with correct params', async () => {
      const { sut, hasher, changePasswordDataFake } = makeSut()

      await sut.execute(changePasswordDataFake)

      expect(hasher.hash).toHaveBeenCalledWith('any_password')
    })

    it('calls UserRepository.update with correct params', async () => {
      const { sut, userRepository, changePasswordDataFake } = makeSut()

      await sut.execute(changePasswordDataFake)

      expect(userRepository.update).toHaveBeenCalledWith({
        props: {
          aggregateRoot: {
            props: {
              email: expect.any(Object),
              emailConfirmed: expect.any(Object),
              id: expect.any(Object),
              name: expect.any(Object),
              password: expect.any(Object),
              token: expect.any(Object)
            }
          }
        }
      })
    })

    it('returns a message', async () => {
      const { sut, changePasswordDataFake } = makeSut()

      const result = await sut.execute(changePasswordDataFake)

      expect(result.value).toEqual({
        message: 'password updated successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns InvalidPasswordError when passwords do not match', async () => {
      const { sut, changePasswordDataFake } = makeSut()

      const result = await sut.execute({ ...changePasswordDataFake, passwordRetype: 'anything' })

      expect(result.value[0]).toBeInstanceOf(InvalidPasswordError)
    })

    it('returns an Error when UserRepository.readById fails', async () => {
      const { sut, userRepository, errorFake, changePasswordDataFake } = makeSut()
      jest.spyOn(userRepository, 'readById').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(changePasswordDataFake)

      expect(result.value[0]).toEqual(errorFake)
    })

    it('returns NotFoundError when userRepository.readById returns null', async () => {
      const { sut, userRepository, changePasswordDataFake } = makeSut()
      jest.spyOn(userRepository, 'readById').mockResolvedValueOnce(right(null))

      const result = await sut.execute(changePasswordDataFake)

      expect(result.value[0]).toBeInstanceOf(NotFoundError)
    })

    it('returns an Error when Hasher.hash fails', async () => {
      const { sut, hasher, errorFake, changePasswordDataFake } = makeSut()
      jest.spyOn(hasher, 'hash').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(changePasswordDataFake)

      expect(result.value[0]).toEqual(errorFake)
    })

    it('returns an Error when UserRepository.update fails', async () => {
      const { sut, userRepository, errorFake, changePasswordDataFake } = makeSut()
      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(changePasswordDataFake)

      expect(result.value[0]).toEqual(errorFake)
    })
  })
})
