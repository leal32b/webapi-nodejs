import { Encrypter } from '@/core/1.application/cryptography/encrypter'
import { JsonwebtokenAdapter } from '@/core/3.infra/cryptography/jsonwebtoken/jsonwebtoken-adapter'

export const makeJsonwebtoken: Encrypter = new JsonwebtokenAdapter()
