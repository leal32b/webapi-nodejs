import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either } from '@/core/0.domain/utils/either'

export abstract class Validator<ConstructParamsType> {
  protected constructor (protected readonly props?: ConstructParamsType) {}

  abstract validate (field: string, input: any): Either<DomainError, void>
}
