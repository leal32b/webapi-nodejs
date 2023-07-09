import { getVar, setVar } from '@/common/0.domain/utils/var'
import { cryptography, persistence } from '@/common/4.main/container'

import { UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { GroupEntity } from '@/identity/0.domain/entities/group.entity'
import { UserEntity } from '@/identity/0.domain/entities/user.entity'
import { UserEmailConfirmed } from '@/identity/0.domain/value-objects/user.email-confirmed.value-object'

const initPersistence = async (): Promise<void> => {
  await persistence.actual.client.connect()
  setVar('NODE_ENV', 'test')
  await persistence.actual.client.clearDatabase()
  setVar('NODE_ENV', 'development')

  const { groupRepository, userRepository } = persistence.actual.repositories

  // Group
  const userGroupEntity = GroupEntity.create({ name: 'user' }).value as GroupEntity
  const masterGroupEntity = GroupEntity.create({ name: 'master' }).value as GroupEntity
  await groupRepository.create(userGroupEntity)
  await groupRepository.create(masterGroupEntity)

  // User
  const masterName = getVar('MASTER_USER')
  const masterPassword = getVar('MASTER_PASSWORD')
  const masterHashedPassword = (await cryptography.hasher.hash(masterPassword)).value as string
  const masterUserEntity = UserEntity.create({
    email: 'master@mail.com',
    locale: 'en',
    name: masterName,
    password: masterHashedPassword,
    token: 'any_token'
  }).value as UserEntity
  const masterUserAggregate = UserAggregate.create(masterUserEntity)
  const userEmailConfirmed = UserEmailConfirmed.create(true).value as UserEmailConfirmed
  masterUserAggregate.setEmailConfirmed(userEmailConfirmed)
  await userRepository.create(masterUserAggregate)
}

(async () => {
  await initPersistence()
})()
