import { colorFunction } from '@/core/3.infra/logging/winston/color-function'

type LoggerParams = {
  label: string
  level: string
  message: string | Record<string, unknown> | any[]
}

export const printfFunction = ({ level, label, message }: LoggerParams): string => {
  let adjustedMessage = message as string

  if (Array.isArray(message)) {
    adjustedMessage = message.reduce((msg: string, cur: string) => {
      const adjustedMsg = typeof msg === 'string' ? msg : JSON.stringify(msg)
      const adjustedCur = typeof cur === 'string' ? cur : JSON.stringify(cur)

      return `${adjustedMsg} ${adjustedCur}`
    })
  }

  if (typeof message === 'object' && !Array.isArray(message)) {
    adjustedMessage = JSON.stringify(message)
  }

  return `${level}: ${colorFunction(label)}: ${adjustedMessage}`
}

