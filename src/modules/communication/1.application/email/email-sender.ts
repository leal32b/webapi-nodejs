import { EmailEntity } from '@/communication/0.domain/entities/email-entity'
import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either } from '@/core/0.domain/utils/either'

export interface EmailSender {
  send: (email: EmailEntity) => Promise<Either<DomainError, void>>
}
