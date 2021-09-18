import { AddAccountModel } from '@/0.domain/interfaces/add-account'
import { AccountModel } from '@/0.domain/models/account'
import { AddAccountRepository } from '@/1.application/interfaces/add-account-repository'
import { MongodbHelper } from '@/3.infra/database/mongodb/helpers/mongodb-helper'

export class AccountMongodbRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongodbHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = { ...accountData, id: result.insertedId.toString() }

    return account
  }
}
