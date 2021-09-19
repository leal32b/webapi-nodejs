import { DbAddAccount } from '@/1.application/usecases/db-add-account'
import { EmailValidatorAdapter } from '@/2.adapter/adapters/email-validator'
import { SignUpController } from '@/2.adapter/controllers/sign-up'
import { BcryptAdapter } from '@/3.infra/cryptography/bcrypt'
import { AccountMongodbRepository } from '@/3.infra/database/mongodb/repositories/account'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongodbRepository = new AccountMongodbRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongodbRepository)

  return new SignUpController(emailValidatorAdapter, dbAddAccount)
}
