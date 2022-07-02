import argon2id from 'argon2'

import DomainError from '@/0.domain/base/domain-error'
import { Either, left, right } from '@/0.domain/utils/either'
import Hasher from '@/1.application/interfaces/hasher'
import ServerError from '@/2.presentation/errors/server'

export default class ArgonAdapter implements Hasher {
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
}
