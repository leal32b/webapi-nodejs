import { GroupEntity } from '@/identity/0.domain/entities/group.entity'

export const makeGroupEntityFake = (): GroupEntity => GroupEntity.create({
  name: 'any_name'
}).value as GroupEntity
