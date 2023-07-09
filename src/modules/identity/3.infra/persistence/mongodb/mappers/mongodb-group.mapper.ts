import { ObjectId } from 'mongodb'

import { GroupEntity } from '@/identity/0.domain/entities/group.entity'

export class MongodbGroupMapper {
  public static toDomain (user: Record<string, any>): GroupEntity {
    const groupEntity = GroupEntity.create({
      createdAt: user.createdAt,
      id: user._id.toString(),
      name: user.name,
      updatedAt: user.updatedAt
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
