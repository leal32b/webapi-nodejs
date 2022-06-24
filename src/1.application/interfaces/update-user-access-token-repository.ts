import DomainError from '@/0.domain/base/domain-error'
import { Either } from '@/0.domain/utils/either'

export default interface UpdateUserAccessTokenRepository {
  update: (id: string, accessToken: string) => Promise<Either<DomainError, true>>
}
