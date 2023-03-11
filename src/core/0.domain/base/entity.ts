import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type ValueObject } from '@/core/0.domain/base/value-object'
import { type Either, left, right } from '@/core/0.domain/utils/either'
import { Identifier } from '@/core/0.domain/utils/identifier'

type Params = Record<string, Either<DomainError[], ValueObject<any>>>

export abstract class Entity<PropsType> {
  protected readonly props: PropsType & { id: Identifier }

  protected constructor (props: PropsType, id?: string) {
    this.props = {
      ...props,
      id: Identifier.create({ id })
    }
  }

  public static validateParams <ParamsType>(params: Params): Either<DomainError[], ParamsType> {
    const errors = Object.values(params)
      .map(param => param.isLeft() ? param.value : [])
      .reduce((acc, curVal) => acc.concat(curVal))

    if (errors.length > 0) {
      return left(errors)
    }

    const validatedParams = Object.fromEntries(
      Object.entries(params)
        .map(([param, result]) => [param, result.value])
    )

    return right(validatedParams as ParamsType)
  }
}
