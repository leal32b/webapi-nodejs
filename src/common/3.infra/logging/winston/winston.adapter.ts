import winston, { format, transports, type Logger as WinstonLogger } from 'winston'

import { type Logger } from '@/common/1.application/logging/logger'

type Props = {
  printfFunction: (params: Record<string, unknown>) => string
}

export class WinstonAdapter implements Logger {
  private readonly logger: WinstonLogger

  private constructor (props: Props) {
    const { combine, printf, colorize } = format

    this.logger = winston.createLogger({
      format: combine(
        colorize({ level: true }),
        printf(props.printfFunction)
      ),
      transports: [new transports.Console()]
    })
  }

  public static create (props: Props): WinstonAdapter {
    return new WinstonAdapter(props)
  }

  error (label: string, message: string | Record<string, unknown> | string[]): void {
    this.logger.error({ label, message })
  }

  info (label: string, message: string | Record<string, unknown> | string[]): void {
    this.logger.info({ label, message })
  }
}
