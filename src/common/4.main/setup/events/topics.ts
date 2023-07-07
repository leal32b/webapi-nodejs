import { type Topic } from '@/common/1.application/events/message-broker'

import { communicationTopics } from '@/communication/4.main/setup/events/communication.topics'
import { identityTopics } from '@/identity/4.main/setup/events/identity.topics'

export const topics: Topic[] = [
  ...communicationTopics,
  ...identityTopics
]
