import { DomainError } from '@/common/0.domain/base/domain-error'
import { left, right } from '@/common/0.domain/utils/either'

import { UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { type GroupRepository } from '@/identity/1.application/repositories/group.repository'
import { type UserRepository } from '@/identity/1.application/repositories/user.repository'
import { type SetGroupsData, SetGroupsUseCase } from '@/identity/1.application/use-cases/set-groups.use-case'

import { makeErrorFake } from '~/common/_doubles/fakes/error.fake'
import { makeUserAggregateFake } from '~/identity/_doubles/fakes/user-aggregate.fake'
import { makeGroupRepositoryStub } from '~/identity/_doubles/stubs/group-repository.stub'
import { makeUserRepositoryStub } from '~/identity/_doubles/stubs/user-repository.stub'

const makeSetGroupsDataFake = (): SetGroupsData => ({
  groups: ['any_group'],
  id: 'any_id'
})

type SutTypes = {
  errorFake: DomainError
  setGroupsDataFake: SetGroupsData
  groupRepository: GroupRepository
  userRepository: UserRepository
  sut: SetGroupsUseCase
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    setGroupsDataFake: makeSetGroupsDataFake()
  }
  const props = {
    groupRepository: makeGroupRepositoryStub(),
    userRepository: makeUserRepositoryStub()
  }

  const sut = SetGroupsUseCase.create(props)
  vi.spyOn(props.userRepository, 'readById').mockResolvedValue(right(makeUserAggregateFake()))

  return {
    ...doubles,
    ...props,
    sut
  }
}

describe('SetGroupsUseCase', () => {
  describe('success', () => {
    it('calls UserRepository.readById with correct params', async () => {
      const { sut, setGroupsDataFake, userRepository } = makeSut()

      await sut.execute(setGroupsDataFake)

      expect(userRepository.readById).toHaveBeenCalledWith('any_id')
    })

    it('calls GroupRepository.readManyByNames with correct params', async () => {
      const { sut, setGroupsDataFake, groupRepository } = makeSut()

      await sut.execute(setGroupsDataFake)

      expect(groupRepository.readManyByNames).toHaveBeenCalledWith(['any_group'])
    })

    it('calls UserRepository.update with correct params', async () => {
      const { sut, setGroupsDataFake, userRepository } = makeSut()

      await sut.execute(setGroupsDataFake)

      expect(userRepository.update).toHaveBeenCalledWith(expect.any(UserAggregate))
    })
  })

  describe('failure', () => {
    it('returns Left with Error when UserRepository.readById fails', async () => {
      const { sut, errorFake, setGroupsDataFake, userRepository } = makeSut()
      vi.spyOn(userRepository, 'readById').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(setGroupsDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when GroupRepository.readManyByNames fails', async () => {
      const { sut, errorFake, setGroupsDataFake, groupRepository } = makeSut()
      vi.spyOn(groupRepository, 'readManyByNames').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(setGroupsDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when UserRepository.update fails', async () => {
      const { sut, errorFake, setGroupsDataFake, userRepository } = makeSut()
      vi.spyOn(userRepository, 'update').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(setGroupsDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
