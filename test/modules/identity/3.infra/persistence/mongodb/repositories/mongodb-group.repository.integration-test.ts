import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence.fixture'
import { persistence } from '@/common/4.main/container'

import { GroupEntity, type GroupEntityProps } from '@/identity/0.domain/entities/group.entity'
import { MongodbGroupRepository } from '@/identity/3.infra/persistence/mongodb/repositories/mongodb-group.repository'

import { makeGroupEntityFake } from '~/identity/_doubles/fakes/group-entity.fake'
import { MongodbGroupFixture } from '~/identity/_fixtures/mongodb/mongodb-group.fixture'

type SutTypes = {
  groupFixture: PersistenceFixture<GroupEntityProps>
  groupEntityFake: GroupEntity
  sut: MongodbGroupRepository
}

const makeSut = (): SutTypes => {
  const collaborators = {
    groupFixture: MongodbGroupFixture.create()
  }
  const doubles = {
    groupEntityFake: makeGroupEntityFake()
  }
  const sut = MongodbGroupRepository.create()

  return {
    ...collaborators,
    ...doubles,
    sut
  }
}

describe('GroupMongodbRepository', () => {
  beforeAll(async () => {
    await persistence.mongodb.client.connect()
  })

  afterEach(async () => {
    await persistence.mongodb.client.clearDatabase()
  })

  describe('success', () => {
    describe('create', () => {
      it('returns Right with null on create', async () => {
        const { sut, groupEntityFake } = makeSut()

        const result = await sut.create(groupEntityFake)

        expect(result.isRight()).toBe(true)
      })
    })

    describe('readByName', () => {
      it('returns Right with null on readByName if group does not exist', async () => {
        const { sut } = makeSut()
        const name = 'any_name2'

        const result = await sut.readByName(name)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBe(null)
      })

      it('returns Right with GroupEntity on readByName', async () => {
        const { sut, groupFixture } = makeSut()
        const { name } = await groupFixture.createFixture()

        const result = await sut.readByName(name)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(GroupEntity)
      })
    })

    describe('readManyByNames', () => {
      it('returns Right with null on readManyByName if groups do not exist', async () => {
        const { sut } = makeSut()
        const names = ['any_name']

        const result = await sut.readManyByNames(names)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBe(null)
      })

      it('returns Right with an array of GroupEntity on readManyByNames', async () => {
        const { sut, groupFixture } = makeSut()
        const groups = await groupFixture.createFixture(2)
        const names = groups.map(group => group.name)

        const result = await sut.readManyByNames(names)

        expect(result.isRight()).toBe(true)
        expect((result.value as GroupEntity[])
          .every(item => item instanceof GroupEntity)).toBe(true)
      })
    })
  })

  describe('failure', () => {
    describe('create', () => {
      it('returns Left when create throws', async () => {
        const { sut, groupEntityFake } = makeSut()
        vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

        const result = await sut.create(groupEntityFake)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readByName', () => {
      it('returns Left when readByName throws', async () => {
        const { sut } = makeSut()
        const name = 'any_name'
        vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

        const result = await sut.readByName(name)

        expect(result.isLeft()).toBe(true)
      })
    })
  })
})
