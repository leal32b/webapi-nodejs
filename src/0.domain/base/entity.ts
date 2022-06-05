import ValueObject from '@/0.domain/base/value-object'
import { Either, left, right } from '@/0.domain/utils/either'

type ErrorResult = {
  [key: string]: Error[]
}

type Params = {
  [key: string]: Either<Error[], ValueObject>
}

export default abstract class Entity {
  static validateParams <T> (params: Params): Either<ErrorResult, T> {
    const errors = {}
    Object.entries(params).forEach(([param, result]) => {
      if (result.isLeft()) {
        errors[param] = result.value
      }
    })

    if (Object.keys(errors).length) {
      return left(errors)
    }

    const validatedParams: T = {} as any
    Object.entries(params).forEach(([param, result]) => {
      validatedParams[param] = result.value
    })

    return right(validatedParams)
  }
}
