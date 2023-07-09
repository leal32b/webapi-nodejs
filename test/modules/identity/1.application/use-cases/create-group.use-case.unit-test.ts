import { DomainError } from '@/common/0.domain/base/domain-error'
import { left, right } from '@/common/0.domain/utils/either'
import { NameTakenError } from '@/common/1.application/errors/name-taken.error'

import { GroupEntity } from '@/identity/0.domain/entities/group.entity'
import { type GroupRepository } from '@/identity/1.application/repositories/group.repository'
import { type CreateGroupData, CreateGroupUseCase } from '@/identity/1.application/use-cases/create-group.use-case'

import { makeErrorFake } from '~/common/_doubles/fakes/error.fake'
import { makeGroupRepositoryStub } from '~/identity/_doubles/stubs/group-repository.stub'

const makeCreateGroupDataFake = (): CreateGroupData => ({
  name: 'any_name'
})

type SutTypes = {
  createGroupDataFake: CreateGroupData
  errorFake: DomainError
  groupRepository: GroupRepository
  sut: CreateGroupUseCase
}

const makeSut = (): SutTypes => {
  const doubles = {
    createGroupDataFake: makeCreateGroupDataFake(),
    errorFake: makeErrorFake()
  }
  const props = {
    groupRepository: makeGroupRepositoryStub()
  }

  const sut = CreateGroupUseCase.create(props)

  return {
    ...doubles,
    ...props,
    sut
  }
}

describe('CreateGroupUseCase', () => {
  describe('success', () => {
    it('calls GroupRepository.readByName with correct params', async () => {
      const { sut, groupRepository, createGroupDataFake } = makeSut()

      await sut.execute(createGroupDataFake)

      expect(groupRepository.readByName).toHaveBeenCalledWith('any_name')
    })

    it('calls GroupRepository.create with correct params', async () => {
      const { sut, groupRepository, createGroupDataFake } = makeSut()

      await sut.execute(createGroupDataFake)

      expect(groupRepository.create).toHaveBeenCalledWith(expect.any(GroupEntity))
    })

    it('returns Right with message and name when execute succeeds', async () => {
      const { sut, createGroupDataFake } = makeSut()

      const result = await sut.execute(createGroupDataFake)

      expect(result.isRight()).toBe(true)
      expect(result.value).toEqual({
        message: 'group created successfully',
        name: 'any_name'
      })
    })
  })

  describe('failure', () => {
    it('returns Left with Error when GroupRepository.readByName fails', async () => {
      const { sut, groupRepository, errorFake, createGroupDataFake } = makeSut()
      vi.spyOn(groupRepository, 'readByName').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(createGroupDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with NameTakenError when name is already in use', async () => {
      const { sut, groupRepository, createGroupDataFake } = makeSut()
      vi.spyOn(groupRepository, 'readByName').mockResolvedValueOnce(
        right(GroupEntity.create(createGroupDataFake).value as GroupEntity)
      )

      const result = await sut.execute(createGroupDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(NameTakenError)
    })

    it('returns Left with Error when GroupEntity.create fails', async () => {
      const { sut, createGroupDataFake } = makeSut()

      const result = await sut.execute({ ...createGroupDataFake, name: null })

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
