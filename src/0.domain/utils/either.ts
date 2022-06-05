export type Either<L, A> = Left<L, A> | Right<L, A>

export class Left<L, A> {
  constructor (readonly value: L) {}

  isLeft (): this is Left<L, A> {
    return true
  }

  isRight (): this is Right<L, A> {
    return false
  }

  applyOnRight<B>(_: (a: A) => B): Either<L, B> {
    return this as any
  }
}

export class Right<L, A> {
  constructor (readonly value: A) {}

  isLeft (): this is Left<L, A> {
    return false
  }

  isRight (): this is Right<L, A> {
    return true
  }

  applyOnRight<B>(func: (a: A) => B): Either<L, B> {
    return new Right(func(this.value))
  }
}

export const left = <L, A>(l: L): Either<L, A> => {
  return new Left(l)
}

export const right = <L, A>(a: A): Either<L, A> => {
  return new Right<L, A>(a)
}
