import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { Identifier } from '@/common/0.domain/utils/identifier'

type PropsOrErrors<PropsType> = { [K in keyof PropsType]: Either<DomainError[], PropsType[K]> }

export type BasePropsType = {
  active?: boolean
  createdAt?: Date
  id?: string
  updatedAt?: Date
}

export abstract class Entity<PropsType> {
  protected readonly _props: BasePropsType & PropsType

  protected constructor (props: BasePropsType & PropsType) {
    this._props = {
      ...props,
      ...(!props.id && {
        active: true,
        createdAt: new Date(),
        id: Identifier.create().value,
        updatedAt: new Date()
      })
    }
  }

  public static validateProps <PropsType>(props: PropsOrErrors<PropsType>): Either<DomainError[], PropsType> {
    const errors = Object
      .values(props)
      .map(prop => (prop as any).isLeft() ? (prop as any).value : [])
      .reduce((acc, curVal) => acc.concat(curVal))

    if (errors.length > 0) {
      return left(errors)
    }

    const validatedProps = Object.fromEntries(
      Object
        .entries(props)
        .map(([prop, result]) => [prop, (result as any).value])
    )

    return right(validatedProps as PropsType)
  }

  public get props (): typeof this._props {
    return this._props
  }
}
