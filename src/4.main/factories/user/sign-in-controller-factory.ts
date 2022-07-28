import AuthenticateUserUseCase from '@/1.application/use-cases/authenticate-user-use-case'
import SignInController from '@/2.presentation/controllers/sign-in-controller'
import ArgonAdapter from '@/3.infra/cryptography/argon/argon-adapter'
import JsonwebtokenAdapter from '@/3.infra/cryptography/jsonwebtoken/jsonwebtoken-adapter'
import PgUserRepository from '@/3.infra/persistence/postgres/repositories/pg-user-repository'

export default (): SignInController => {
  const salt = 12
  const userRepository = new PgUserRepository()
  const hasher = new ArgonAdapter({ salt })
  const encrypter = new JsonwebtokenAdapter()
  const authenticateUserUseCase = new AuthenticateUserUseCase({ userRepository, hasher, encrypter })

  return new SignInController({ authenticateUserUseCase })
}
