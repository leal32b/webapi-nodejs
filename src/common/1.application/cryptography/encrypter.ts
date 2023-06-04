import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either } from '@/common/0.domain/utils/either'

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
  encrypt: (tokenData: TokenData) => Promise<Either<DomainError, string>>
}
