import DomainError from '@/0.domain/base/domain-error'
import { Either, left, right } from '@/0.domain/utils/either'
import UseCase from '@/1.application/base/use-case'
import Encrypter, { TokenType } from '@/1.application/cryptography/encrypter'
import Hasher from '@/1.application/cryptography/hasher'
import UserRepository from '@/1.application/repositories/user-repository'

export type AuthenticateUserData = {
  email: string
  password: string
}

export type AuthenticateUserResultDTO = {
  accessToken: string
  message: string
}
export default class AuthenticateUserUseCase extends UseCase<AuthenticateUserData, AuthenticateUserResultDTO> {
  constructor (private readonly props: {
    userRepository: UserRepository
    hasher: Hasher
    encrypter: Encrypter
  }) { super() }

  async execute (authenticateUserData: AuthenticateUserData): Promise<Either<DomainError[], AuthenticateUserResultDTO>> {
    const { hasher, encrypter, userRepository } = this.props
    const userAggregateOrError = await userRepository.readByEmail(authenticateUserData.email)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value
    const { id, password } = userAggregate.aggregateRoot
    const passwordIsValidOrError = await hasher.compare(authenticateUserData.password, password.value)

    if (passwordIsValidOrError.isLeft()) {
      return left([passwordIsValidOrError.value])
    }

    const accessTokenOrError = await encrypter.encrypt({
      type: TokenType.access, payload: { id: id.value }
    })

    if (accessTokenOrError.isLeft()) {
      return left([accessTokenOrError.value])
    }

    const accessToken = accessTokenOrError.value
    userAggregate.setToken(accessToken)
    const accessTokenUpdatedOrError = await userRepository.update(userAggregate)

    if (accessTokenUpdatedOrError.isLeft()) {
      return left(accessTokenUpdatedOrError.value)
    }

    return right({
      accessToken,
      message: 'user authenticated successfully'
    })
  }
}
