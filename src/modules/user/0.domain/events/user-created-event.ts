import { Event, type Props } from '@/core/1.application/base/event'

type UserCreatedPayload = {
  email: string
  locale: string
  token: string
}

export class UserCreatedEvent extends Event<UserCreatedPayload> {
  public static create (props: Props<UserCreatedPayload>): UserCreatedEvent {
    return new UserCreatedEvent(props)
  }
}
