import { DomainError } from '@/common/0.domain/base/domain-error'
import { left, right } from '@/common/0.domain/utils/either'
import { type Hasher } from '@/common/1.application/cryptography/hasher'
import { NotFoundError } from '@/common/1.application/errors/not-found-error'
import { PasswordMismatchError } from '@/common/1.application/errors/password-mismatch-error'

import { UserAggregate } from '@/identity/0.domain/aggregates/user-aggregate'
import { UserPassword } from '@/identity/0.domain/value-objects/user.password'
import { type UserRepository } from '@/identity/1.application/repositories/user-repository'
import { type ChangePasswordData, ChangePasswordUseCase } from '@/identity/1.application/use-cases/change-password-use-case'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'
import { makeHasherStub } from '~/common/_doubles/stubs/hasher-stub'
import { makeUserAggregateFake } from '~/identity/_doubles/user-aggregate-fake'
import { makeUserRepositoryStub } from '~/identity/_doubles/user-repository-stub'

const makeChangePasswordDataFake = (): ChangePasswordData => ({
  id: 'any_id',
  password: 'any_password',
  passwordRetype: 'any_password'
})

type SutTypes = {
  changePasswordDataFake: ChangePasswordData
  errorFake: DomainError
  hasher: Hasher
  userRepository: UserRepository
  sut: ChangePasswordUseCase
}

const makeSut = (): SutTypes => {
  const doubles = {
    changePasswordDataFake: makeChangePasswordDataFake(),
    errorFake: makeErrorFake()
  }
  const props = {
    hasher: makeHasherStub(),
    userRepository: makeUserRepositoryStub()
  }
  const sut = ChangePasswordUseCase.create(props)
  vi.spyOn(props.userRepository, 'readById').mockResolvedValue(right(makeUserAggregateFake()))

  return {
    ...doubles,
    ...props,
    sut
  }
}

describe('SignInUseCase', () => {
  describe('success', () => {
    it('calls UserRepository.readById with correct params', async () => {
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

      expect(userRepository.update).toHaveBeenCalledWith(expect.any(UserAggregate))
    })

    it('returns Right with message', async () => {
      const { sut, changePasswordDataFake } = makeSut()

      const result = await sut.execute(changePasswordDataFake)

      expect(result.isRight()).toBe(true)
      expect(result.value).toEqual({
        message: 'password updated successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns Left with PasswordMismatchError when passwords do not match', async () => {
      const { sut, changePasswordDataFake } = makeSut()

      const result = await sut.execute({ ...changePasswordDataFake, passwordRetype: 'anything' })

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(PasswordMismatchError)
    })

    it('returns Left with Error when UserRepository.readById fails', async () => {
      const { sut, userRepository, errorFake, changePasswordDataFake } = makeSut()
      vi.spyOn(userRepository, 'readById').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(changePasswordDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with NotFoundError when userRepository.readById returns null', async () => {
      const { sut, userRepository, changePasswordDataFake } = makeSut()
      vi.spyOn(userRepository, 'readById').mockResolvedValueOnce(right())

      const result = await sut.execute(changePasswordDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(NotFoundError)
    })

    it('returns Left with Error when Hasher.hash fails', async () => {
      const { sut, hasher, errorFake, changePasswordDataFake } = makeSut()
      vi.spyOn(hasher, 'hash').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(changePasswordDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when UserPassword.create fails', async () => {
      const { sut, errorFake, changePasswordDataFake } = makeSut()
      vi.spyOn(UserPassword, 'create').mockReturnValueOnce(left([errorFake]))

      const result = await sut.execute(changePasswordDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when UserRepository.update fails', async () => {
      const { sut, userRepository, errorFake, changePasswordDataFake } = makeSut()
      vi.spyOn(userRepository, 'update').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(changePasswordDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
