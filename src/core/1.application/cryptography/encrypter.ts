import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either } from '@/core/0.domain/utils/either'

export enum TokenType {
  email = 'email',
  access = 'access'
}

export type TokenData = {
  type: TokenType
  payload?: {
    id: string
    auth: string[]
  }
}

export interface Encrypter {
  decrypt: (token: string) => Promise<Either<DomainError, TokenData>>
  encrypt: (data: TokenData) => Promise<Either<DomainError, string>>
}
