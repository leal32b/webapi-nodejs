import { CreateUserUsecase } from '@/1.application/usecases/create-user'
import { SignUpController } from '@/2.adapter/controllers/sign-up'
import { BcryptAdapter } from '@/3.infra/cryptography/bcrypt'
import { UserMongodbRepository } from '@/3.infra/database/mongodb/repositories/user'
import { EmailValidatorAdapter } from '@/3.infra/validators/email-validator'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const userMongodbRepository = new UserMongodbRepository()
  const dbCreateUser = new CreateUserUsecase(bcryptAdapter, userMongodbRepository)

  return new SignUpController(emailValidatorAdapter, dbCreateUser)
}
