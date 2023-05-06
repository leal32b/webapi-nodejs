import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { UseCase } from '@/common/1.application/base/use-case'
import { type Encrypter, TokenType } from '@/common/1.application/cryptography/encrypter'
import { type Hasher } from '@/common/1.application/cryptography/hasher'
import { InvalidPasswordError } from '@/common/1.application/errors/invalid-password-error'
import { NotFoundError } from '@/common/1.application/errors/not-found-error'

import { type UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { Token } from '@/user/0.domain/value-objects/token'
import { type UserRepository } from '@/user/1.application/repositories/user-repository'

type Props = {
  userRepository: UserRepository
  hasher: Hasher
  encrypter: Encrypter
}

export type AuthenticateUserData = {
  email: string
  password: string
}

export type AuthenticateUserResultDTO = {
  accessToken: string
  message: string
}

export class AuthenticateUserUseCase extends UseCase<Props, AuthenticateUserData, AuthenticateUserResultDTO> {
  public static create (props: Props): AuthenticateUserUseCase {
    return new AuthenticateUserUseCase(props)
  }

  public async execute (authenticateUserData: AuthenticateUserData): Promise<Either<DomainError[], AuthenticateUserResultDTO>> {
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

    return updatedOrError.applyOnRight(() => ({
      accessToken: token.value,
      message: 'user authenticated successfully'
    }))
  }

  private async createAccessToken (id: string): Promise<Either<DomainError[], Token>> {
    const { encrypter } = this.props

    const accessTokenOrError = await encrypter.encrypt({
      payload: {
        auth: ['user'],
        id
      },
      type: TokenType.access
    })

    if (accessTokenOrError.isLeft()) {
      return left([accessTokenOrError.value])
    }

    const accessToken = accessTokenOrError.value
    const tokenOrError = Token.create(accessToken)

    return tokenOrError.applyOnRight(token => token)
  }

  private async isPasswordValid (hashedPassword: string, password: string): Promise<Either<DomainError[], void>> {
    const { hasher } = this.props
    const passwordIsValidOrError = await hasher.compare(hashedPassword, password)

    if (passwordIsValidOrError.isLeft()) {
      return left([passwordIsValidOrError.value])
    }

    const passwordIsValid = passwordIsValidOrError.value

    if (!passwordIsValid) {
      return left([InvalidPasswordError.create()])
    }

    return right()
  }

  private async readUserAggregate (email: string): Promise<Either<DomainError[], UserAggregate>> {
    const { userRepository } = this.props
    const userAggregateOrError = await userRepository.readByEmail(email)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value

    if (!userAggregate) {
      return left([NotFoundError.create('email', email)])
    }

    return right(userAggregate)
  }

  private async updateUserAggregate (userAggregate: UserAggregate, token: Token): Promise<Either<DomainError[], void>> {
    const { userRepository } = this.props

    userAggregate.token = token
    const updatedUserOrError = await userRepository.update(userAggregate)

    return updatedUserOrError.applyOnRight(() => {})
  }
}
