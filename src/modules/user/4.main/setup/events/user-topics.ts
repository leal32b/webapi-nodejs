import { type Topic } from '@/core/1.application/types/topic'
import { userCreatedTopic } from '@/user/1.application/events/topics/user-created-topic'

export const userTopics: Topic[] = [
  userCreatedTopic
]
