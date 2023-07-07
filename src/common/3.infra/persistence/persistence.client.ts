import { type Either } from '@/common/0.domain/utils/either'

export interface PersistenceClient {
  clearDatabase: () => Promise<Either<Error, void>>
  close: () => Promise<Either<Error, void>>
  connect: (message?: string) => Promise<Either<Error, void>>
}
