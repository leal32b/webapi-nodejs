
import jwt, { JwtPayload } from 'jsonwebtoken'

import { DomainError } from '@/0.domain/base/domain-error'
import { Either, left, right } from '@/0.domain/utils/either'
import { Encrypter, TokenData } from '@/1.application/cryptography/encrypter'
import { ServerError } from '@/2.presentation/errors/server-error'

export class JsonwebtokenAdapter implements Encrypter {
  secret: string = process.env.JWT_SECRET

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

  async decrypt (token: string): Promise<Either<DomainError, JwtPayload>> {
    try {
      const result = await jwt.verify(token, this.secret)

      return right(result as JwtPayload)
    } catch (error) {
      return left(new ServerError(error.message, error.stack))
    }
  }
}
