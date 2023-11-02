import { ObjectId } from 'mongodb'

import { GroupEntity } from '@/identity/0.domain/entities/group.entity'

export class MongodbGroupMapper {
  public static toDomain (group: Record<string, any>): GroupEntity {
    const groupEntity = GroupEntity.create({
      createdAt: group.createdAt,
      id: group._id.toString(),
      name: group.name,
      updatedAt: group.updatedAt
    })

    return groupEntity.value as GroupEntity
  }

  public static toPersistence (groupEntity: GroupEntity): Record<string, any> {
    return {
      _id: new ObjectId(groupEntity.props.id),
      createdAt: groupEntity.props.createdAt,
      name: groupEntity.props.name.value,
      updatedAt: groupEntity.props.updatedAt
    }
  }
}
