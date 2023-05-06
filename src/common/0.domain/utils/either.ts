export type Either<FailType, SuccessType> = Left<FailType, SuccessType> | Right<FailType, SuccessType>

export class Left<FailType, SuccessType> {
  constructor (readonly value: FailType) {}

  public applyOnRight<ReturnType>(_: (success: SuccessType) => ReturnType): Either<FailType, ReturnType> {
    return this as any
  }

  public isLeft (): this is Left<FailType, SuccessType> {
    return true
  }

  public isRight (): this is Right<FailType, SuccessType> {
    return false
  }
}

export class Right<FailType, SuccessType> {
  constructor (readonly value?: SuccessType) {}

  public applyOnRight<ReturnType>(func: (success?: SuccessType) => ReturnType): Either<FailType, ReturnType> {
    return new Right(func(this.value))
  }

  public isLeft (): this is Left<FailType, SuccessType> {
    return false
  }

  public isRight (): this is Right<FailType, SuccessType> {
    return true
  }
}

export const left = <FailType, SuccessType>(fail: FailType): Either<FailType, SuccessType> => {
  return new Left(fail)
}

export const right = <FailType, SuccessType>(success?: SuccessType): Either<FailType, SuccessType> => {
  return new Right<FailType, SuccessType>(success)
}
