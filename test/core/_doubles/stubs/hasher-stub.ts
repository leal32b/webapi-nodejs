import { right } from '@/core/0.domain/utils/either'
import { type Hasher } from '@/core/1.application/cryptography/hasher'

export const makeHasherStub = (): Hasher => ({
  compare: vi.fn(() => right(true)),
  hash: vi.fn(() => right('hashed_password'))
} as any)
