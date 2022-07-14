import DomainError from '@/0.domain/base/domain-error'
import { Either } from '@/0.domain/utils/either'

export type Result<T> = {
  message: string
} & T

export default abstract class UseCase<Input, Output> {
  abstract execute (input: Input): Promise<Either<DomainError[], Result<Output>>>
}
