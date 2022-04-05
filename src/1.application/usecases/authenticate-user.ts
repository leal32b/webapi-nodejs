import HashComparer from '@/1.application/interfaces/hash-comparer'
import ReadUserByEmailRepository from '@/1.application/interfaces/read-user-by-email-repository'
import TokenGenerator from '@/1.application/interfaces/token-generator'
import UpdateUserAccessTokenRepository from '@/1.application/interfaces/update-user-access-token-repository'
import Usecase from '@/1.application/interfaces/usecase'
import { AuthenticationData } from '@/1.application/types/user-types'

export default class AuthenticateUserUsecase implements Usecase<AuthenticationData, string> {
  constructor (private readonly props: {
    readUserByEmailRepository: ReadUserByEmailRepository
    hashComparer: HashComparer
    tokenGenerator: TokenGenerator
    updateUserAccessTokenRepository: UpdateUserAccessTokenRepository
  }) {}

  async execute (authenticationData: AuthenticationData): Promise<string> {
    const user = await this.props.readUserByEmailRepository.read(authenticationData.email)

    if (!user) {
      return null
    }

    const isPasswordValid = await this.props.hashComparer.compare(authenticationData.password, user.props.password)

    if (!isPasswordValid) {
      return null
    }

    const accessToken = await this.props.tokenGenerator.generate(user.props.id)
    await this.props.updateUserAccessTokenRepository.update(user.props.id, accessToken)

    return accessToken
  }
}
