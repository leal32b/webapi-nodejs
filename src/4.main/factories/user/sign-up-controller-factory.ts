import { CreateUserUseCase } from '@/1.application/use-cases/create-user-use-case'
import { SignUpController } from '@/2.presentation/controllers/sign-up-controller'
import { config } from '@/4.main/config/config'

export const signUpControllerFactory = (): SignUpController => {
  const { userRepository } = config.persistence
  const { hasher, encrypter } = config.cryptography
  const createUserUseCase = new CreateUserUseCase({ userRepository, hasher, encrypter })

  return new SignUpController({ createUserUseCase })
}
