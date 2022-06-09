import { Either, left } from '@/0.domain/utils/either'
import InvalidPasswordError from '@/1.application/errors/invalid-password'
import HashComparer from '@/1.application/interfaces/hash-comparer'
import ReadUserByEmailRepository from '@/1.application/interfaces/read-user-by-email-repository'
import TokenGenerator from '@/1.application/interfaces/token-generator'
import UpdateUserAccessTokenRepository from '@/1.application/interfaces/update-user-access-token-repository'
import UseCase from '@/1.application/interfaces/use-case'
import { AuthenticationData } from '@/1.application/types/authentication-data'

export default class AuthenticateUserUseCase implements UseCase<AuthenticationData, string> {
  constructor (private readonly props: {
    hashComparer: HashComparer
    readUserByEmailRepository: ReadUserByEmailRepository
    tokenGenerator: TokenGenerator
    updateUserAccessTokenRepository: UpdateUserAccessTokenRepository
  }) {}

  async execute (authenticationData: AuthenticationData): Promise<Either<Error, string>> {
    const {
      hashComparer,
      readUserByEmailRepository,
      tokenGenerator,
      updateUserAccessTokenRepository
    } = this.props
    const user = await readUserByEmailRepository.read(authenticationData.email)

    if (user.isLeft()) {
      return left(user.value)
    }

    const { id, password } = user.value.props
    const isPasswordValid = await hashComparer.compare(authenticationData.password, password.value)

    if (!isPasswordValid) {
      return left(new InvalidPasswordError())
    }

    const accessToken = await tokenGenerator.generate(id.value)
    const result = await updateUserAccessTokenRepository.update(id.value, accessToken)

    return result.applyOnRight(() => accessToken)
  }
}
