import { Either } from '@/core/0.domain/utils/either'

export interface PersistenceClient {
  connect: (message?: string) => Promise<Either<Error, void>>
  close: () => Promise<Either<Error, void>>
  clearDatabase: () => Promise<Either<Error, void>>
}
