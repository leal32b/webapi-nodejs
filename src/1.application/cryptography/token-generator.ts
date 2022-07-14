import DomainError from '@/0.domain/base/domain-error'
import { Either } from '@/0.domain/utils/either'

export enum TokenType {
  email = 'email',
  access = 'access'
}

type TokenData<T = {}> = {
  type: TokenType
  payload?: T
}
export default interface TokenGenerator {
  generate: (input: TokenData) => Promise<Either<DomainError, string>>
}
