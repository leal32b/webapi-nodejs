import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { UseCase } from '@/common/1.application/base/use-case'
import { type Encrypter, TokenType } from '@/common/1.application/cryptography/encrypter'
import { type Hasher } from '@/common/1.application/cryptography/hasher'
import { EmailTakenError } from '@/common/1.application/errors/email-taken-error'
import { PasswordMismatchError } from '@/common/1.application/errors/password-mismatch-error'

import { UserAggregate } from '@/identity/0.domain/aggregates/user-aggregate'
import { type UserRepository } from '@/identity/1.application/repositories/user-repository'

type Props = {
  userRepository: UserRepository
  hasher: Hasher
  encrypter: Encrypter
}

export type SignUpUserData = {
  email: string
  locale: string
  name: string
  password: string
  passwordRetype: string
}

export type SignUpUserResultDTO = {
  email: string
  message: string
}

export class SignUpUserUseCase extends UseCase<Props, SignUpUserData, SignUpUserResultDTO> {
  public static create (props: Props): SignUpUserUseCase {
    return new SignUpUserUseCase(props)
  }

  public async execute (signUpUserData: SignUpUserData): Promise<Either<DomainError[], SignUpUserResultDTO>> {
    const { encrypter, hasher } = this.props
    const { email, password } = signUpUserData

    const validOrError = await this.initialValidation(signUpUserData)

    if (validOrError.isLeft()) {
      return left(validOrError.value)
    }

    const hashedPasswordOrError = await hasher.hash(password)

    if (hashedPasswordOrError.isLeft()) {
      return left([hashedPasswordOrError.value])
    }

    const tokenOrError = await encrypter.encrypt({ type: TokenType.email })

    if (tokenOrError.isLeft()) {
      return left([tokenOrError.value])
    }

    const hashedPassword = hashedPasswordOrError.value
    const token = tokenOrError.value
    const userAggregateOrError = await this.createUserAggregate(signUpUserData, hashedPassword, token)

    return userAggregateOrError.applyOnRight(() => ({
      email,
      message: 'user signed up successfully'
    }))
  }

  private async createUserAggregate (signUpUserData: SignUpUserData, hashedPassword: string, token: string): Promise<Either<DomainError[], UserAggregate>> {
    const { userRepository } = this.props

    const userAggregateOrError = UserAggregate.create({
      ...signUpUserData,
      password: hashedPassword,
      token
    })

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value
    const createdUserOrError = await userRepository.create(userAggregate)

    return createdUserOrError.applyOnRight(() => userAggregate)
  }

  private async initialValidation (signUpUserData: SignUpUserData): Promise<Either<DomainError[], void>> {
    const { userRepository } = this.props
    const { email, password, passwordRetype } = signUpUserData

    if (password !== passwordRetype) {
      return left([PasswordMismatchError.create('password')])
    }

    const userAggregateByEmailOrError = await userRepository.readByEmail(email)

    if (userAggregateByEmailOrError.isLeft()) {
      return left(userAggregateByEmailOrError.value)
    }

    if (userAggregateByEmailOrError.value) {
      return left([EmailTakenError.create('email', email)])
    }

    return right()
  }
}
