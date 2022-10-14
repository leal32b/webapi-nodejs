import { ArgonAdapter } from '@/core/3.infra/cryptography/argon/argon-adapter'

export const makeArgon = new ArgonAdapter({ salt: 12 })
