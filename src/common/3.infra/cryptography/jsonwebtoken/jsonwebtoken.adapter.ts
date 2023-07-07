import jwt from 'jsonwebtoken'

import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { getVar } from '@/common/0.domain/utils/var'
import { type Encrypter, type TokenData } from '@/common/1.application/cryptography/encrypter'
import { ServerError } from '@/common/2.presentation/errors/server.error'

export class JsonwebtokenAdapter implements Encrypter {
  private readonly secret = getVar('JWT_SECRET')

  private constructor () {}

  public static create (): JsonwebtokenAdapter {
    return new JsonwebtokenAdapter()
  }

  public async decrypt (token: string): Promise<Either<DomainError, TokenData>> {
    try {
      const result = await jwt.verify(token, this.secret)

      return right(result as TokenData)
    } catch (error) {
      return left(ServerError.create(error.message, error.stack))
    }
  }

  public async encrypt (tokenData: TokenData, expiresIn: string | number = '1d'): Promise<Either<DomainError, string>> {
    try {
      const result = await jwt.sign(tokenData, this.secret, {
        expiresIn
      })

      return right(result)
    } catch (error) {
      return left(ServerError.create(error.message, error.stack))
    }
  }
}
