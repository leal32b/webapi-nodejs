import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either } from '@/common/0.domain/utils/either'

import { type EmailEntity } from '@/communication/0.domain/entities/email.entity'

export interface EmailSender {
  send: (email: EmailEntity) => Promise<Either<DomainError, void>>
}
