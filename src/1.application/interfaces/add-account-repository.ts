import { AddAccountModel } from '@/0.domain/interfaces/add-account'
import { AccountModel } from '@/0.domain/models/account'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
