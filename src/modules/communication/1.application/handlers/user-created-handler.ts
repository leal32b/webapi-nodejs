import { Handler } from '@/core/0.domain/base/handler'
import { DomainEvents } from '@/core/0.domain/events/domain-events'
import { UserCreatedEvent } from '@/user/0.domain/events/user-created-event'

export class UserCreatedHandler extends Handler {
  constructor () {
    super()
    this.setupSubscriptions()
  }

  setupSubscriptions (): void {
    DomainEvents.register(this.onUserCreatedEvent.bind(this), UserCreatedEvent.name)
  }

  private async onUserCreatedEvent (event: UserCreatedEvent): Promise<void> {
    console.log('event >>>', event)
  }
}
