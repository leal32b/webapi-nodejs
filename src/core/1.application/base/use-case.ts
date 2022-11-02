import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either } from '@/core/0.domain/utils/either'

export type Result<OutputType> = {
  message: string
} & OutputType

export abstract class UseCase<ConstructParamsType, InputType, OutputType> {
  protected constructor (protected readonly props: ConstructParamsType) {}

  abstract execute (input: InputType): Promise<Either<DomainError[], Result<OutputType>>>
}
