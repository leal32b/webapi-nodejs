import { userCreatedTopic } from '@/communication/1.application/events/topics/user-created-topic'
import { type Queue } from '@/core/1.application/types/queue'

export const userCreatedQueue: Queue = {
  key: ['userCreated', '#'],
  name: 'userCreatedQueue',
  topics: [userCreatedTopic]
}
