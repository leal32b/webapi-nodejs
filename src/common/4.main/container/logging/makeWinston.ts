import { type Logger } from '@/common/1.application/logging/logger'
import { printfFunction } from '@/common/3.infra/logging/winston/printf-function'
import { WinstonAdapter } from '@/common/3.infra/logging/winston/winston-adapter'

export const makeWinston: Logger = WinstonAdapter.create({ printfFunction })
