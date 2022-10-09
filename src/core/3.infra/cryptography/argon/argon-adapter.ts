import argon2id from 'argon2'

import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { ServerError } from '@/core/2.presentation/errors/server-error'

export class ArgonAdapter implements Hasher {
  constructor (private readonly props: {
    salt: number
  }) {}

  async hash (value: string): Promise<Either<DomainError, string>> {
    try {
      const { salt } = this.props
      const hash = await argon2id.hash(value, { saltLength: salt })

      return right(hash)
    } catch (error) {
      return left(new ServerError(error.message, error.stack))
    }
  }

  async compare (hash: string, value: string): Promise<Either<DomainError, boolean>> {
    try {
      const result = await argon2id.verify(hash, value)

      return right(result)
    } catch (error) {
      return left(new ServerError(error.message, error.stack))
    }
  }
}
