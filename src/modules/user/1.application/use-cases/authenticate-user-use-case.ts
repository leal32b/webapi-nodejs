import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { UseCase } from '@/core/1.application/base/use-case'
import { Encrypter, TokenType } from '@/core/1.application/cryptography/encrypter'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { InvalidPasswordError } from '@/core/1.application/errors/invalid-password-error'
import { NotFoundError } from '@/core/1.application/errors/not-found-error'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { Token } from '@/user/0.domain/value-objects/token'
import { UserRepository } from '@/user/1.application/repositories/user-repository'

export type AuthenticateUserData = {
  email: string
  password: string
}

export type AuthenticateUserResultDTO = {
  accessToken: string
  message: string
}

export class AuthenticateUserUseCase extends UseCase<AuthenticateUserData, AuthenticateUserResultDTO> {
  constructor (private readonly props: {
    userRepository: UserRepository
    hasher: Hasher
    encrypter: Encrypter
  }) { super() }

  async execute (authenticateUserData: AuthenticateUserData): Promise<Either<DomainError[], AuthenticateUserResultDTO>> {
    const { email, password } = authenticateUserData

    const userAggregateOrError = await this.readUserAggregate(email)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value
    const { id, password: hashedPassword } = userAggregate
    const passwordValidOrError = await this.isPasswordValid(hashedPassword.value, password)

    if (passwordValidOrError.isLeft()) {
      return left(passwordValidOrError.value)
    }

    const tokenOrError = await this.createAccessToken(id.value)

    if (tokenOrError.isLeft()) {
      return left(tokenOrError.value)
    }

    const token = tokenOrError.value
    const updatedOrError = await this.updateUserAggregate(userAggregate, token)

    if (updatedOrError.isLeft()) {
      return left(updatedOrError.value)
    }

    return right({
      accessToken: token.value,
      message: 'user authenticated successfully'
    })
  }

  private async readUserAggregate (email: string): Promise<Either<DomainError[], UserAggregate>> {
    const { userRepository } = this.props
    const userAggregateOrError = await userRepository.readByEmail(email)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value

    if (!userAggregate) {
      return left([new NotFoundError('email', email)])
    }

    return right(userAggregate)
  }

  private async isPasswordValid (hashedPassword: string, password: string): Promise<Either<DomainError[], void>> {
    const { hasher } = this.props
    const passwordIsValidOrError = await hasher.compare(hashedPassword, password)

    if (passwordIsValidOrError.isLeft()) {
      return left([passwordIsValidOrError.value])
    }

    const passwordIsValid = passwordIsValidOrError.value
    if (!passwordIsValid) {
      return left([new InvalidPasswordError()])
    }

    return right()
  }

  private async createAccessToken (id: string): Promise<Either<DomainError[], Token>> {
    const { encrypter } = this.props

    const accessTokenOrError = await encrypter.encrypt({
      type: TokenType.access,
      payload: {
        id,
        auth: ['user']
      }
    })

    if (accessTokenOrError.isLeft()) {
      return left([accessTokenOrError.value])
    }

    const accessToken = accessTokenOrError.value
    const tokenOrError = Token.create(accessToken)

    if (tokenOrError.isLeft()) {
      return left(tokenOrError.value)
    }

    return right(tokenOrError.value)
  }

  private async updateUserAggregate (userAggregate: UserAggregate, token: Token): Promise<Either<DomainError[], UserAggregate>> {
    const { userRepository } = this.props

    userAggregate.token = token
    const updatedUserOrError = await userRepository.update(userAggregate)

    if (updatedUserOrError.isLeft()) {
      return left(updatedUserOrError.value)
    }

    return right()
  }
}
