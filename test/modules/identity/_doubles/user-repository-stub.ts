import { right } from '@/common/0.domain/utils/either'

import { type UserRepository } from '@/identity/1.application/repositories/user-repository'

export const makeUserRepositoryStub = (): UserRepository => ({
  create: vi.fn(() => right()),
  readByEmail: vi.fn(() => right()),
  readById: vi.fn(() => right()),
  update: vi.fn(() => right())
} as any)
