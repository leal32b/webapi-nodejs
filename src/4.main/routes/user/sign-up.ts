import CreateUserUseCase from '@/1.application/use-cases/create-user-use-case'
import SignUpController from '@/2.presentation/controllers/sign-up-controller'
import { Route, RouteType } from '@/2.presentation/types/route'
import ArgonAdapter from '@/3.infra/cryptography/argon/argon-adapter'
import JsonwebtokenAdapter from '@/3.infra/cryptography/jsonwebtoken/jsonwebtoken-adapter'
import PgUserRepository from '@/3.infra/persistence/postgres/repositories/pg-user-repository'

export default (): Route => {
  const salt = 12
  const userRepository = new PgUserRepository()
  const hasher = new ArgonAdapter({ salt })
  const encrypter = new JsonwebtokenAdapter()
  const createUserUseCase = new CreateUserUseCase({ userRepository, hasher, encrypter })
  const signUpController = new SignUpController({ createUserUseCase })

  return {
    path: '/sign-up',
    type: RouteType.post,
    controller: signUpController
  }
}
