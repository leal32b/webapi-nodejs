import { DomainEvent, DomainEventConstructorParams } from '@/core/0.domain/base/domain-event'

type UserCreatedPayload = {
  email: string
  token: string
}

export class UserCreatedEvent extends DomainEvent<UserCreatedPayload> {
  public static create (props: DomainEventConstructorParams<UserCreatedPayload>): UserCreatedEvent {
    return new UserCreatedEvent(props)
  }
}
