import { DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { Identifier } from '@/core/0.domain/utils/identifier'

type Params = {
  [key: string]: Either<DomainError[], ValueObject<any>>
}

export abstract class Entity<T> {
  protected readonly props: T & { id: Identifier }

  constructor (props: T, id?: string) {
    this.props = {
      ...props,
      id: new Identifier({ id })
    }
  }

  static validateParams <T>(params: Params): Either<DomainError[], T> {
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

    return right(validatedParams as T)
  }
}
