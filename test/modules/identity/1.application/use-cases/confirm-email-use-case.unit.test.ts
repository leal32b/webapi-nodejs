import { DomainError } from '@/common/0.domain/base/domain-error'
import { left, right } from '@/common/0.domain/utils/either'
import { NotFoundError } from '@/common/1.application/errors/not-found-error'

import { UserAggregate } from '@/identity/0.domain/aggregates/user-aggregate'
import { EmailConfirmed } from '@/identity/0.domain/value-objects/email-confirmed'
import { type UserRepository } from '@/identity/1.application/repositories/user-repository'
import { type ConfirmEmailData, ConfirmEmailUseCase } from '@/identity/1.application/use-cases/confirm-email-use-case'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'
import { makeUserAggregateFake } from '~/identity/_doubles/user-aggregate-fake'
import { makeUserRepositoryStub } from '~/identity/_doubles/user-repository-stub'

const makeConfirmEmailDataFake = (): ConfirmEmailData => ({
  token: 'any_token'
})

type SutTypes = {
  sut: ConfirmEmailUseCase
  userRepository: UserRepository
  confirmEmailDataFake: ConfirmEmailData
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const doubles = {
    confirmEmailDataFake: makeConfirmEmailDataFake(),
    errorFake: makeErrorFake()
  }
  const props = {
    userRepository: makeUserRepositoryStub()
  }

  const sut = ConfirmEmailUseCase.create(props)
  vi.spyOn(props.userRepository, 'readByToken').mockResolvedValue(right(makeUserAggregateFake()))

  return { sut, ...props, ...doubles }
}

describe('ConfirmEmailUseCase', () => {
  describe('success', () => {
    it('calls UserRepository.readByToken with correct params', async () => {
      const { sut, userRepository, confirmEmailDataFake } = makeSut()

      await sut.execute(confirmEmailDataFake)

      expect(userRepository.readByToken).toHaveBeenCalledWith('any_token')
    })

    it('calls UserRepository.update with correct params', async () => {
      const { sut, userRepository, confirmEmailDataFake } = makeSut()

      await sut.execute(confirmEmailDataFake)

      expect(userRepository.update).toHaveBeenCalledWith(expect.any(UserAggregate))
    })

    it('returns Right with message when execute succeeds', async () => {
      const { sut, confirmEmailDataFake } = makeSut()

      const result = await sut.execute(confirmEmailDataFake)

      expect(result.isRight()).toBe(true)
      expect(result.value).toEqual({
        message: 'email confirmed successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns Left with Error when UserRepository.readByToken fails', async () => {
      const { sut, userRepository, confirmEmailDataFake, errorFake } = makeSut()
      vi.spyOn(userRepository, 'readByToken').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(confirmEmailDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with NotFoundError when no user is found', async () => {
      const { sut, userRepository, confirmEmailDataFake } = makeSut()
      vi.spyOn(userRepository, 'readByToken').mockResolvedValueOnce(right())

      const result = await sut.execute(confirmEmailDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(NotFoundError)
    })

    it('returns Left with Error when EmailConfirmed.create fails', async () => {
      const { sut, confirmEmailDataFake, errorFake } = makeSut()
      vi.spyOn(EmailConfirmed, 'create').mockReturnValueOnce(left([errorFake]))

      const result = await sut.execute(confirmEmailDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
