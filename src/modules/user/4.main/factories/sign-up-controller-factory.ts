import { config } from '@/core/4.main/config/config'
import { CreateUserUseCase } from '@/user/1.application/use-cases/create-user-use-case'
import { SignUpController } from '@/user/2.presentation/controllers/sign-up-controller'

export const signUpControllerFactory = (): SignUpController => {
  const { userRepository } = config.persistence
  const { hasher, encrypter } = config.cryptography
  const createUserUseCase = new CreateUserUseCase({ userRepository, hasher, encrypter })

  return new SignUpController({ createUserUseCase })
}
