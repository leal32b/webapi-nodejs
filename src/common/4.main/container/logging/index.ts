import { type Logger } from '@/common/1.application/logging/logger'
import { makeWinston } from '@/common/4.main/container/logging/makeWinston'

export type Logging = {
  logger: Logger
}

export const logging: Logging = {
  logger: makeWinston
}
