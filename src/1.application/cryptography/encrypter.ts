import DomainError from '@/0.domain/base/domain-error'
import { Either } from '@/0.domain/utils/either'

export enum TokenType {
  email = 'email',
  access = 'access'
}

export type TokenData<T = {}> = {
  type: TokenType
  payload?: T
}

export default interface Encrypter {
  encrypt: (data: TokenData) => Promise<Either<DomainError, string>>
  decrypt: (token: string) => Promise<Either<DomainError, any>>
}
