import { AddAccount, AddAccountModel } from '@/0.domain/interfaces/add-account'
import { AccountModel } from '@/0.domain/models/account'
import { AddAccountRepository } from '@/1.application/interfaces/add-account-repository'
import { Encrypter } from '@/1.application/interfaces/encryter'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)

    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })

    return account
  }
}
