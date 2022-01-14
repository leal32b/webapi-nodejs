import CreateUserUsecase from '@/1.application/usecases/create-user'
import SignUpController from '@/2.presentation/controllers/sign-up'
import LogControllerDecorator from '@/2.presentation/decorators/log-controller'
import Controller from '@/2.presentation/interfaces/controller'
import LogErrorRepository from '@/2.presentation/interfaces/log-error-repository'
import BcryptAdapter from '@/3.infra/cryptography/bcrypt'
import UserMongodbRepository from '@/3.infra/databases/mongodb/repositories/user'
import { makeSignUpValidators } from '@/4.main/factories/sign-up-validators'

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const userRepository = new UserMongodbRepository()
  const createUserUsecase = new CreateUserUsecase({
    hasher: bcryptAdapter,
    createUserRepository: userRepository
  })
  const validator = makeSignUpValidators()
  const signUpController = new SignUpController({
    validator,
    createUserUsecase
  })

  return new LogControllerDecorator(signUpController, makeLogErrorRepositoryStub())
}
