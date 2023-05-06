import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either } from '@/common/0.domain/utils/either'

export abstract class Validator<PropsType> {
  protected constructor (protected readonly props?: PropsType) {}

  abstract validate (field: string, input: any): Either<DomainError, void>
}
