export type Either<L, A> = Left<L, A> | Right<L, A>

export class Left<L, A> {
  constructor (readonly value: L) {}

  public applyOnRight<B>(_: (a: A) => B): Either<L, B> {
    return this as any
  }

  public isLeft (): this is Left<L, A> {
    return true
  }

  public isRight (): this is Right<L, A> {
    return false
  }
}

export class Right<L, A> {
  constructor (readonly value?: A) {}

  public applyOnRight<B>(func: (a?: A) => B): Either<L, B> {
    return new Right(func(this.value))
  }

  public isLeft (): this is Left<L, A> {
    return false
  }

  public isRight (): this is Right<L, A> {
    return true
  }
}

export const left = <L, A>(l: L): Either<L, A> => {
  return new Left(l)
}

export const right = <L, A>(a?: A): Either<L, A> => {
  return new Right<L, A>(a)
}
