import CreateUserUseCase from '@/1.application/use-cases/create-user'
import SignUpController from '@/2.presentation/controllers/sign-up'
import { Route, RouteType } from '@/2.presentation/types/route'
import ArgonAdapter from '@/3.infra/cryptography/argon'
import UserPostgresRepository from '@/3.infra/persistence/postgres/repositories/user'

export default (): Route => {
  const salt = 12
  const hasher = new ArgonAdapter({ salt })
  const createUserRepository = new UserPostgresRepository()
  const createUserUseCase = new CreateUserUseCase({ hasher, createUserRepository })
  const signUpController = new SignUpController({ createUserUseCase })

  return {
    path: '/sign-up',
    type: RouteType.post,
    controller: signUpController
  }
}
