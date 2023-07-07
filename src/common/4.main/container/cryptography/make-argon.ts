import { type Hasher } from '@/common/1.application/cryptography/hasher'
import { ArgonAdapter } from '@/common/3.infra/cryptography/argon/argon.adapter'

export const makeArgon: Hasher = ArgonAdapter.create({ salt: 12 })
