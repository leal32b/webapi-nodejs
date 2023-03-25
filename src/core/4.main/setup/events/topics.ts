import { communicationTopics } from '@/communication/4.main/setup/events/communication-topics'
import { type Topic } from '@/core/1.application/types/topic'
import { userTopics } from '@/user/4.main/setup/events/user-topics'

export const topics: Topic[] = [
  ...communicationTopics,
  ...userTopics
]
