import { type DomainError } from '@/core/0.domain/base/domain-error'
import { DomainEvents } from '@/core/0.domain/events/domain-events'
import { type Either, left, right } from '@/core/0.domain/utils/either'
import { UseCase } from '@/core/1.application/base/use-case'
import { type Encrypter, TokenType } from '@/core/1.application/cryptography/encrypter'
import { type Hasher } from '@/core/1.application/cryptography/hasher'
import { EmailTakenError } from '@/core/1.application/errors/email-taken-error'
import { PasswordMismatchError } from '@/core/1.application/errors/password-mismatch-error'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { type UserRepository } from '@/user/1.application/repositories/user-repository'

type Props = {
  userRepository: UserRepository
  hasher: Hasher
  encrypter: Encrypter
}

export type CreateUserData = {
  email: string
  locale: string
  name: string
  password: string
  passwordRetype: string
}

export type CreateUserResultDTO = {
  email: string
  message: string
}

export class CreateUserUseCase extends UseCase<Props, CreateUserData, CreateUserResultDTO> {
  public static create (props: Props): CreateUserUseCase {
    return new CreateUserUseCase(props)
  }

  public async execute (createUserData: CreateUserData): Promise<Either<DomainError[], CreateUserResultDTO>> {
    const { email, password } = createUserData

    const validOrError = await this.initialValidation(createUserData)

    if (validOrError.isLeft()) {
      return left(validOrError.value)
    }

    const hashedPasswordOrError = await this.hashPassword(password)

    if (hashedPasswordOrError.isLeft()) {
      return left(hashedPasswordOrError.value)
    }

    const tokenOrError = await this.createToken()

    if (tokenOrError.isLeft()) {
      return left(tokenOrError.value)
    }

    const hashedPassword = hashedPasswordOrError.value
    const token = tokenOrError.value
    const userAggregateOrError = await this.createUserAggregate(createUserData, hashedPassword, token)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value
    DomainEvents.dispatchEventsForAggregate(userAggregate.id)

    return right({
      email,
      message: 'user created successfully'
    })
  }

  private async createToken (): Promise<Either<DomainError[], string>> {
    const { encrypter } = this.props

    const tokenOrError = await encrypter.encrypt({ type: TokenType.email })

    if (tokenOrError.isLeft()) {
      return left([tokenOrError.value])
    }

    const token = tokenOrError.value

    return right(token)
  }

  private async createUserAggregate (createUserData: CreateUserData, hashedPassword: string, token: string): Promise<Either<DomainError[], UserAggregate>> {
    const { userRepository } = this.props

    const userAggregateOrError = UserAggregate.create({
      ...createUserData,
      password: hashedPassword,
      token
    })

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value
    const createdUserOrError = await userRepository.create(userAggregate)

    if (createdUserOrError.isLeft()) {
      return left(createdUserOrError.value)
    }

    return right(userAggregate)
  }

  private async hashPassword (password: string): Promise<Either<DomainError[], string>> {
    const { hasher } = this.props

    const hashedPasswordOrError = await hasher.hash(password)

    if (hashedPasswordOrError.isLeft()) {
      return left([hashedPasswordOrError.value])
    }

    const hashedPassword = hashedPasswordOrError.value

    return right(hashedPassword)
  }

  private async initialValidation (createUserData: CreateUserData): Promise<Either<DomainError[], void>> {
    const { email, password, passwordRetype } = createUserData

    if (password !== passwordRetype) {
      return left([PasswordMismatchError.create('password')])
    }

    const emailAvailableOrError = await this.isEmailAvailable(email)

    if (emailAvailableOrError.isLeft()) {
      return left(emailAvailableOrError.value)
    }

    return right()
  }

  private async isEmailAvailable (email: string): Promise<Either<DomainError[], void>> {
    const { userRepository } = this.props
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
