import { cryptography, persistence } from '@/core/4.main/container'
import { CreateUserUseCase } from '@/user/1.application/use-cases/create-user-use-case'
import { SignUpController } from '@/user/2.presentation/controllers/sign-up-controller'

export const signUpControllerFactory = (): SignUpController => {
  const { userRepository } = persistence.actual.repositories
  const { hasher, encrypter } = cryptography
  const createUserUseCase = new CreateUserUseCase({ userRepository, hasher, encrypter })

  return new SignUpController({ createUserUseCase })
}
