import { Either } from '@/0.domain/utils/either'

export default interface Hasher {
  hash: (value: string) => Promise<Either<Error, string>>
}
