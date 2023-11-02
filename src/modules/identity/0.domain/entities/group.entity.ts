import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type BasePropsType, Entity } from '@/common/0.domain/base/entity'
import { type Either, left, right } from '@/common/0.domain/utils/either'

import { GroupName } from '@/identity/0.domain/value-objects/group.name.value-object'

type Props = {
  name: GroupName
}

export type GroupEntityProps = BasePropsType & {
  name: string
}

export class GroupEntity extends Entity<Props> {
  public static create (props: GroupEntityProps): Either<DomainError[], GroupEntity> {
    const { name } = props
    const { createdAt, id, updatedAt } = props

    const validPropsOrError = this.validateProps<Props>({
      name: GroupName.create(name)
    })

    if (validPropsOrError.isLeft()) {
      return left(validPropsOrError.value)
    }

    const validProps = {
      ...validPropsOrError.value,
      createdAt,
      id,
      updatedAt
    }

    return right(new GroupEntity(validProps))
  }

  public get id (): string {
    return this.props.id
  }

  public get name (): GroupName {
    return this.props.name
  }

  public set name (value: GroupName) {
    this.props.name = value
    this.updated()
  }
}
