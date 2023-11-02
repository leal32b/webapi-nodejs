import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { PostgresGroupEntity } from '@/identity/3.infra/persistence/postgres/entities/postgres-group.entity'
import { PostgresUserEntity } from '@/identity/3.infra/persistence/postgres/entities/postgres-user.entity'

@Entity({ name: 'user_group' })
export class PostgresUserGroupEntity {
  @PrimaryColumn({ type: 'text' })
    userId: string

  @PrimaryColumn({ type: 'text' })
    groupId: string

  @ManyToOne(() => PostgresUserEntity, user => user.id)
  @JoinColumn({ name: 'userId' })
    user: PostgresUserEntity

  @ManyToOne(() => PostgresGroupEntity, group => group.id)
  @JoinColumn({ name: 'groupId' })
    group: PostgresGroupEntity
}
