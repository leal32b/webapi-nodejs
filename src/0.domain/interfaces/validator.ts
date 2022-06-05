import { Either } from '@/0.domain/utils/either'

export default interface Validator {
  validate: (input: any) => Either<Error, true>
}
