import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { UseCase } from '@/common/1.application/base/use-case'
import { type Encrypter, TokenType } from '@/common/1.application/cryptography/encrypter'
import { type Hasher } from '@/common/1.application/cryptography/hasher'
import { InvalidPasswordError } from '@/common/1.application/errors/invalid-password-error'
import { NotFoundError } from '@/common/1.application/errors/not-found-error'

import { type UserAggregate } from '@/identity/0.domain/aggregates/user-aggregate'
import { UserToken } from '@/identity/0.domain/value-objects/user.token'
import { type UserRepository } from '@/identity/1.application/repositories/user-repository'

type Props = {
  userRepository: UserRepository
  hasher: Hasher
  encrypter: Encrypter
}

export type SignInData = {
  email: string
  password: string
}

export type SignInResultDTO = {
  accessToken: string
  message: string
}

export class SignInUseCase extends UseCase<Props, SignInData, SignInResultDTO> {
  public static create (props: Props): SignInUseCase {
    return new SignInUseCase(props)
  }

  public async execute (signInData: SignInData): Promise<Either<DomainError[], SignInResultDTO>> {
    const { email, password } = signInData

    const userAggregateOrError = await this.readUserAggregate(email)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value
    const { id, password: hashedPassword } = userAggregate.aggregateRoot
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
      message: 'user signed in successfully'
    }))
  }

  private async createAccessToken (id: string): Promise<Either<DomainError[], UserToken>> {
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
    const tokenOrError = UserToken.create(accessToken)

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

  private async updateUserAggregate (userAggregate: UserAggregate, token: UserToken): Promise<Either<DomainError[], void>> {
    const { userRepository } = this.props

    userAggregate.setToken(token)
    const updatedUserOrError = await userRepository.update(userAggregate)

    return updatedUserOrError.applyOnRight(() => {})
  }
}
