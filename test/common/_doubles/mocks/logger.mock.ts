import { type Logger } from '@/common/1.application/logging/logger'

export const makeLoggerMock = (): Logger => {
  class LoggerMock implements Logger {
    public static create (): LoggerMock {
      return new LoggerMock()
    }

    error (label: string, message: string | any[] | Record<string, unknown>): void {}

    info (label: string, message: string | any[] | Record<string, unknown>): void {}
  }

  return LoggerMock.create()
}
