import CreateUserUsecase from '@/1.application/usecases/create-user'
import SignUpController from '@/2.adapter/controllers/sign-up'
import LogControllerDecorator from '@/2.adapter/decorators/log-controller'
import Controller from '@/2.adapter/interfaces/controller'
import LogErrorRepository from '@/2.adapter/interfaces/log-error-repository'
import BcryptAdapter from '@/3.infra/cryptography/bcrypt'
// import UserMongodbRepository from '@/3.infra/databases/mongodb/repositories/user'
import UserPostgresRepository from '@/3.infra/databases/postgres/repositories/user'
import EmailValidatorAdapter from '@/3.infra/validators/email-validator'

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
  const emailValidator = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const userRepository = new UserPostgresRepository()
  const createUserUsecase = new CreateUserUsecase({
    hasher: bcryptAdapter,
    createUserRepository: userRepository
  })
  const signUpController = new SignUpController({
    createUserUsecase,
    emailValidator
  })

  return new LogControllerDecorator(signUpController, makeLogErrorRepositoryStub())
}
