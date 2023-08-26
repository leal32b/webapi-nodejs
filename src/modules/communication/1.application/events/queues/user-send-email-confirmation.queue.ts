import { type Queue } from '@/common/1.application/events/message-broker'

const userEventsTopic = { name: 'userEventsTopic' }

export const userSendEmailConfirmationQueue: Queue = {
  key: ['userCreated', '#'],
  name: 'userSendEmailConfirmationQueue',
  topics: [userEventsTopic]
}
