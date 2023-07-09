import { right } from '@/common/0.domain/utils/either'

import { type GroupRepository } from '@/identity/1.application/repositories/group.repository'

export const makeGroupRepositoryStub = (): GroupRepository => ({
  create: vi.fn(() => right()),
  readByName: vi.fn(() => right())
} as any)
