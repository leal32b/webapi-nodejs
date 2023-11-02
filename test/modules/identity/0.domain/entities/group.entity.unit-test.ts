import { DomainError } from '@/common/0.domain/base/domain-error'

import { GroupEntity, type GroupEntityProps } from '@/identity/0.domain/entities/group.entity'
import { GroupName } from '@/identity/0.domain/value-objects/group.name.value-object'

const makePropsFake = (): GroupEntityProps => ({
  name: 'any_name'
})

type SutTypes = {
  propsFake: GroupEntityProps
  sut: typeof GroupEntity
}

const makeSut = (): SutTypes => {
  const doubles = {
    propsFake: makePropsFake()
  }
  const sut = GroupEntity

  return {
    ...doubles,
    sut
  }
}

describe('GroupEntity', () => {
  describe('success', () => {
    it('returns GroupEntity when props are valid', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect(result.value).toBeInstanceOf(GroupEntity)
    })

    it('gets name', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as GroupEntity).name).toBeInstanceOf(GroupName)
    })

    it('sets name', () => {
      const { sut, propsFake } = makeSut()
      const name = GroupName.create('any_name').value as GroupName

      const result = sut.create(propsFake)
      const groupEntity = result.value as GroupEntity
      groupEntity.name = name

      expect(groupEntity.name.value).toBe('any_name')
    })
  })

  describe('failure', () => {
    it('returns Left with an array of Errors when any prop is invalid', () => {
      const { sut, propsFake } = makeSut()
      const name = null

      const result = sut.create({ ...propsFake, name })

      expect(result.isLeft()).toBe(true)
      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })
  })
})
