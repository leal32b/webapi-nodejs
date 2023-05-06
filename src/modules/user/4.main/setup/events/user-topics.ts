import { type Topic } from '@/common/1.application/events/message-broker'

import { userCreatedTopic } from '@/user/1.application/events/topics/user-created-topic'

export const userTopics: Topic[] = [
  userCreatedTopic
]
