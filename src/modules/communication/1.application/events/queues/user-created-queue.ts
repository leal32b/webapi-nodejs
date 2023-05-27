import { type Queue } from '@/common/1.application/events/message-broker'

import { userCreatedTopic } from '@/communication/1.application/events/topics/user-created-topic'

export const userCreatedQueue: Queue = {
  key: ['userCreated', '#'],
  name: 'userCreatedQueue',
  topics: [userCreatedTopic]
}
