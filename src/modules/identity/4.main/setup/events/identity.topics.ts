import { type Topic } from '@/common/1.application/events/message-broker'

import { userCreatedTopic } from '@/identity/1.application/events/topics/user-created.topic'

export const identityTopics: Topic[] = [
  userCreatedTopic
]
