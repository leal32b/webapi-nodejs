import DomainError from '@/0.domain/base/domain-error'
import { Either, left, right } from '@/0.domain/utils/either'
import UseCase from '@/1.application/base/use-case'
import HashComparer from '@/1.application/interfaces/hash-comparer'
import ReadUserByEmailRepository from '@/1.application/interfaces/read-user-by-email-repository'
import TokenGenerator from '@/1.application/interfaces/token-generator'
import UpdateUserAccessTokenRepository from '@/1.application/interfaces/update-user-access-token-repository'
import { AuthenticationData } from '@/1.application/types/authentication-data'

export default class AuthenticateUserUseCase implements UseCase<AuthenticationData, string> {
  constructor (private readonly props: {
    hashComparer: HashComparer
    readUserByEmailRepository: ReadUserByEmailRepository
    tokenGenerator: TokenGenerator
    updateUserAccessTokenRepository: UpdateUserAccessTokenRepository
  }) {}

  async execute (authenticationData: AuthenticationData): Promise<Either<DomainError[], string>> {
    const {
      hashComparer,
      readUserByEmailRepository,
      tokenGenerator,
      updateUserAccessTokenRepository
    } = this.props

    const userOrError = await readUserByEmailRepository.read(authenticationData.email)

    if (userOrError.isLeft()) {
      return left([userOrError.value])
    }

    const user = userOrError.value

    const { id, password } = user.props
    const passwordIsValidOrError = await hashComparer.compare(authenticationData.password, password.value)

    if (passwordIsValidOrError.isLeft()) {
      return left([passwordIsValidOrError.value])
    }

    const accessToken = await tokenGenerator.generate(id.value)
    const accessTokenUpdatedOrError = await updateUserAccessTokenRepository.update(id.value, accessToken)

    if (accessTokenUpdatedOrError.isLeft()) {
      return left([accessTokenUpdatedOrError.value])
    }

    return right(accessToken)
  }
}
