import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type ValueObject } from '@/common/0.domain/base/value-object'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { Identifier } from '@/common/0.domain/utils/identifier'

type Props = Record<string, Either<DomainError[], ValueObject<any>>>

export abstract class Entity<PropsType> {
  protected readonly _props: PropsType & { id: Identifier }

  protected constructor (props: PropsType, id?: string) {
    this._props = {
      ...props,
      id: Identifier.create({ id })
    }
  }

  public static validateProps <PropsType>(props: Props): Either<DomainError[], PropsType> {
    const errors = Object
      .values(props)
      .map(prop => prop.isLeft() ? prop.value : [])
      .reduce((acc, curVal) => acc.concat(curVal))

    if (errors.length > 0) {
      return left(errors)
    }

    const validatedProps = Object.fromEntries(
      Object
        .entries(props)
        .map(([prop, result]) => [prop, result.value])
    )

    return right(validatedProps as PropsType)
  }

  public get props (): typeof this._props {
    return this._props
  }
}
