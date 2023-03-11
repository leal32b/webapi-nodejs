import { right } from '@/core/0.domain/utils/either'
import { type Encrypter, TokenType } from '@/core/1.application/cryptography/encrypter'

export const makeEncrypterStub = (): Encrypter => ({
  decrypt: vi.fn(() => right({
    payload: { anyKey: 'any_value' },
    type: TokenType.access
  })),
  encrypt: vi.fn(() => right('token'))
} as any)
