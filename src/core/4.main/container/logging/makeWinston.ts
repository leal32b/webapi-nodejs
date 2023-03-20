import { type Logger } from '@/core/1.application/logging/logger'
import { printfFunction } from '@/core/3.infra/logging/winston/printf-function'
import { WinstonAdapter } from '@/core/3.infra/logging/winston/winston-adapter'

export const makeWinston: Logger = WinstonAdapter.create({ printfFunction })
