import { AddAccount, AddAccountModel } from '@/0.domain/interfaces/add-account'
import { AccountModel } from '@/0.domain/models/account'
import { Encrypter } from '@/1.application/interfaces/encryter'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)

    return await Promise.resolve(null)
  }
}
