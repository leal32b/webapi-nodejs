import { type Encrypter } from '@/common/1.application/cryptography/encrypter'
import { JsonwebtokenAdapter } from '@/common/3.infra/cryptography/jsonwebtoken/jsonwebtoken.adapter'

export const makeJsonwebtoken: Encrypter = JsonwebtokenAdapter.create()
