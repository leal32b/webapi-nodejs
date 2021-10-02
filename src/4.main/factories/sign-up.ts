import { CreateUserUsecase } from '@/1.application/usecases/create-user'
import { SignUpController } from '@/2.adapter/controllers/sign-up'
import { LogControllerDecorator } from '@/2.adapter/decorators/log-controller'
import { Controller } from '@/2.adapter/interfaces/controller'
import { LogErrorRepository } from '@/2.adapter/interfaces/log-error-repository'
import { BcryptAdapter } from '@/3.infra/cryptography/bcrypt'
import { UserMongodbRepository } from '@/3.infra/database/mongodb/repositories/user'
import { EmailValidatorAdapter } from '@/3.infra/validators/email-validator'

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
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const userMongodbRepository = new UserMongodbRepository()
  const dbCreateUser = new CreateUserUsecase(bcryptAdapter, userMongodbRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, dbCreateUser)

  return new LogControllerDecorator(signUpController, makeLogErrorRepositoryStub())
}
