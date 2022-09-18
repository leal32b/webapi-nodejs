import { DomainError } from '@/core/0.domain/base/domain-error'
import { DomainEvents } from '@/core/0.domain/events/domain-events'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { UseCase } from '@/core/1.application/base/use-case'
import { Encrypter, TokenType } from '@/core/1.application/cryptography/encrypter'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { EmailTakenError } from '@/core/1.application/errors/email-taken-error'
import { PasswordMismatchError } from '@/core/1.application/errors/password-mismatch-error'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { UserRepository } from '@/user/1.application/repositories/user-repository'

export type CreateUserData = {
  name: string
  email: string
  password: string
  passwordRetype: string
}

export type CreateUserResultDTO = {
  email: string
  message: string
}

export class CreateUserUseCase extends UseCase<CreateUserData, CreateUserResultDTO> {
  constructor (private readonly props: {
    userRepository: UserRepository
    hasher: Hasher
    encrypter: Encrypter
  }) { super() }

  async execute (createUserData: CreateUserData): Promise<Either<DomainError[], CreateUserResultDTO>> {
    const { hasher, encrypter, userRepository } = this.props
    const { email, password, passwordRetype } = createUserData

    if (password !== passwordRetype) {
      return left([new PasswordMismatchError('password')])
    }

    const userAggregateByEmailOrError = await userRepository.readByEmail(email)

    if (userAggregateByEmailOrError.isLeft()) {
      return left(userAggregateByEmailOrError.value)
    }

    if (userAggregateByEmailOrError.value) {
      return left([new EmailTakenError('email', email)])
    }

    const hashedPasswordOrError = await hasher.hash(password)

    if (hashedPasswordOrError.isLeft()) {
      return left([hashedPasswordOrError.value])
    }

    const tokenOrError = await encrypter.encrypt({ type: TokenType.email })

    if (tokenOrError.isLeft()) {
      return left([tokenOrError.value])
    }

    const token = tokenOrError.value
    const hashedPassword = hashedPasswordOrError.value
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

    DomainEvents.dispatchEventsForAggregate(userAggregate.id)

    return right({
      email,
      message: 'user created successfully'
    })
  }
}
