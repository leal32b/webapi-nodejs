import jwt from 'jsonwebtoken'

import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { getVar } from '@/core/0.domain/utils/var'
import { Encrypter, TokenData } from '@/core/1.application/cryptography/encrypter'
import { ServerError } from '@/core/2.presentation/errors/server-error'

export class JsonwebtokenAdapter implements Encrypter {
  private readonly secret = getVar('JWT_SECRET')

  async decrypt (token: string): Promise<Either<DomainError, TokenData>> {
    try {
      const result = await jwt.verify(token, this.secret)

      return right(result as TokenData)
    } catch (error) {
      return left(new ServerError(error.message, error.stack))
    }
  }

  async encrypt (data: TokenData, expiresIn: string | number = '1d'): Promise<Either<DomainError, string>> {
    try {
      const result = await jwt.sign(data, this.secret, {
        expiresIn
      })

      return right(result)
    } catch (error) {
      return left(new ServerError(error.message, error.stack))
    }
  }
}
