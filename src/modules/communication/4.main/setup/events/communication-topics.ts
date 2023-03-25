import { userCreatedTopic } from '@/communication/1.application/events/topics/user-created-topic'
import { type Topic } from '@/core/1.application/types/topic'

export const communicationTopics: Topic[] = [
  userCreatedTopic
]
