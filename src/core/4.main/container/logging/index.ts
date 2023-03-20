import { type Logger } from '@/core/1.application/logging/logger'
import { makeWinston } from '@/core/4.main/container/logging/makeWinston'

export type Logging = {
  logger: Logger
}

export const logging: Logging = {
  logger: makeWinston
}
