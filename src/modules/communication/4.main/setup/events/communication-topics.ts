import { userCreatedTopic } from '@/communication/1.application/events/topics/user-created-topic'
import { type Topic } from '@/core/1.application/events/message-broker'

export const communicationTopics: Topic[] = [
  userCreatedTopic
]
