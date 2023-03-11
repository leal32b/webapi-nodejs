import argon2id from 'argon2'

import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'
import { type Hasher } from '@/core/1.application/cryptography/hasher'
import { ServerError } from '@/core/2.presentation/errors/server-error'

type Props = {
  salt: number
}
export class ArgonAdapter implements Hasher {
  private constructor (private readonly props: Props) {}

  public static create (props: Props): ArgonAdapter {
    return new ArgonAdapter(props)
  }

  public async compare (hash: string, value: string): Promise<Either<DomainError, boolean>> {
    try {
      const result = await argon2id.verify(hash, value)

      return right(result)
    } catch (error) {
      return left(ServerError.create(error.message, error.stack))
    }
  }

  public async hash (value: string): Promise<Either<DomainError, string>> {
    try {
      const { salt } = this.props
      const hash = await argon2id.hash(value, { saltLength: salt })

      return right(hash)
    } catch (error) {
      return left(ServerError.create(error.message, error.stack))
    }
  }
}
