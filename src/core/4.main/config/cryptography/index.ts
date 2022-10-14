import { Encrypter } from '@/core/1.application/cryptography/encrypter'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { makeArgon } from '@/core/4.main/config/cryptography/make-argon'
import { makeJsonwebtoken } from '@/core/4.main/config/cryptography/make-jsonwebtoken'

export type Cryptography = {
  encrypter: Encrypter
  hasher: Hasher
}

export const cryptography: Cryptography = {
  encrypter: makeJsonwebtoken,
  hasher: makeArgon
}
