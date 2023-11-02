import { type Queue } from '@/common/1.application/events/message-broker'

import { userEventsTopic } from '@/identity/1.application/events/topics/user-events.topic'

export const userSetGroupQueue: Queue = {
  key: ['userCreated', '#'],
  name: 'userSetGroupQueue',
  topics: [userEventsTopic]
}
