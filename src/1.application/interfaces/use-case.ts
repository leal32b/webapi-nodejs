import { Either } from '@/0.domain/utils/either'

export default interface UseCase<Input, Output> {
  execute: (input: Input) => Promise<Either<Error, Output>>
}
