import DomainError from '@/0.domain/base/domain-error'
import ValueObject from '@/0.domain/base/value-object'
import { Either, left, right } from '@/0.domain/utils/either'
import Identifier from '@/0.domain/utils/identifier'

type Params = {
  [key: string]: Either<DomainError[], ValueObject>
}

export default abstract class Entity<T> {
  readonly props: T & { id: Identifier }

  constructor (props: T, id?: string) {
    this.props = {
      ...props,
      id: new Identifier(id)
    }
  }

  static validateParams <T>(params: Params): Either<DomainError[], T> {
    const errors: DomainError[] = []

    Object.entries(params).forEach(([param, result]) => {
      if (result.isLeft()) {
        errors.push(...result.value)
      }
    })

    if (errors.length > 0) {
      return left(errors)
    }

    const validatedParams: T = {} as any

    Object.entries(params).forEach(([param, result]) => {
      validatedParams[param] = result.value
    })

    return right(validatedParams)
  }

  getValue (): Params {
    const value = {}

    Object.entries(this.props).forEach(([key, object]) => {
      value[key] = object.value
    })

    return value
  }
}
