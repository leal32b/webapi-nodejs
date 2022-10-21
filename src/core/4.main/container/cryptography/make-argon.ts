import { Hasher } from '@/core/1.application/cryptography/hasher'
import { ArgonAdapter } from '@/core/3.infra/cryptography/argon/argon-adapter'

export const makeArgon: Hasher = new ArgonAdapter({ salt: 12 })
