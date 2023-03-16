import { DomainEvent, type DomainEventProps } from '@/core/0.domain/base/domain-event'

type UserCreatedPayload = {
  email: string
  language: string
  token: string
}

export class UserCreatedEvent extends DomainEvent<UserCreatedPayload> {
  public static create (props: DomainEventProps<UserCreatedPayload>): UserCreatedEvent {
    return new UserCreatedEvent(props)
  }
}
