import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either } from '@/common/0.domain/utils/either'

import { type GroupEntity } from '@/identity/0.domain/entities/group.entity'

export interface GroupRepository {
  create: (groupEntity: GroupEntity) => Promise<Either<DomainError[], void>>
  readByName: (name: string) => Promise<Either<DomainError[], GroupEntity>>
}
