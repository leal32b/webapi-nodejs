import { type Topic } from '@/common/1.application/events/message-broker'

import { identityTopics } from '@/identity/4.main/setup/events/identity.topics'

export const topics: Topic[] = [
  ...identityTopics
]
