import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { UseCase } from '@/common/1.application/base/use-case'
import { type Encrypter, TokenType } from '@/common/1.application/cryptography/encrypter'
import { type Hasher } from '@/common/1.application/cryptography/hasher'
import { EmailTakenError } from '@/common/1.application/errors/email-taken.error'
import { PasswordMismatchError } from '@/common/1.application/errors/password-mismatch.error'

import { UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { UserEntity } from '@/identity/0.domain/entities/user.entity'
import { type UserRepository } from '@/identity/1.application/repositories/user.repository'

type Props = {
  userRepository: UserRepository
  hasher: Hasher
  encrypter: Encrypter
}

export type SignUpData = {
  email: string
  locale: string
  name: string
  password: string
  passwordRetype: string
}

export type SignUpResultDTO = {
  email: string
  message: string
}

export class SignUpUseCase extends UseCase<Props, SignUpData, SignUpResultDTO> {
  public static create (props: Props): SignUpUseCase {
    return new SignUpUseCase(props)
  }

  public async execute (signUpData: SignUpData): Promise<Either<DomainError[], SignUpResultDTO>> {
    const { encrypter, hasher } = this.props
    const { email, password } = signUpData

    const validOrError = await this.initialValidation(signUpData)

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
    const userAggregateOrError = await this.createUserAggregate(signUpData, hashedPassword, token)

    return userAggregateOrError.applyOnRight(() => ({
      email,
      message: 'user signed up successfully'
    }))
  }

  private async createUserAggregate (signUpData: SignUpData, hashedPassword: string, token: string): Promise<Either<DomainError[], UserAggregate>> {
    const { userRepository } = this.props

    const userEntityOrError = UserEntity.create({
      ...signUpData,
      password: hashedPassword,
      token
    })

    if (userEntityOrError.isLeft()) {
      return left(userEntityOrError.value)
    }

    const userEntity = userEntityOrError.value
    const userAggregate = UserAggregate.create(userEntity)
    const createdOrError = await userRepository.create(userAggregate)

    return createdOrError.applyOnRight(() => userAggregate)
  }

  private async initialValidation (signUpData: SignUpData): Promise<Either<DomainError[], void>> {
    const { userRepository } = this.props
    const { email, password, passwordRetype } = signUpData

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
