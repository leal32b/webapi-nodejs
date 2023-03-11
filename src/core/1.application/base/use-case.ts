import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either } from '@/core/0.domain/utils/either'

export type Result<OutputType> = {
  message: string
} & OutputType

export abstract class UseCase<PropsType, InputType, OutputType> {
  protected constructor (protected readonly props: PropsType) {}

  abstract execute (input: InputType): Promise<Either<DomainError[], Result<OutputType>>>
}
