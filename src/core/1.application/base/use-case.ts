import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either } from '@/core/0.domain/utils/either'

export type Result<T> = {
  message: string
} & T

export abstract class UseCase<Input, Output> {
  abstract execute (input: Input): Promise<Either<DomainError[], Result<Output>>>
}
