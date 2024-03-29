import { GroupEntity } from '@/identity/0.domain/entities/group.entity'

export class PostgresGroupMapper {
  public static toDomain (user: Record<string, any>): GroupEntity {
    const groupEntity = GroupEntity.create({
      createdAt: user.createdAt,
      id: user.id,
      name: user.name,
      updatedAt: user.updatedAt
    })

    return groupEntity.value as GroupEntity
  }

  public static toPersistence (groupEntity: GroupEntity): Record<string, any> {
    return {
      createdAt: groupEntity.props.createdAt,
      id: groupEntity.props.id,
      name: groupEntity.props.name.value,
      updatedAt: groupEntity.props.updatedAt
    }
  }
}
