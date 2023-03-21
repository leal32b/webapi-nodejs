 type LoggerParams = {
   label: string
   level: string
   message: string | Record<string, unknown> | any[]
 }

export const printfFunction = ({ level, label, message }: LoggerParams): string => {
  let adjustedMessage = message as string
  const keyQuotes = /"([^"]+)":/g

  if (Array.isArray(message)) {
    adjustedMessage = message.reduce((msg: string, cur: string) => {
      const adjustedMsg = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2).replace(keyQuotes, '$1:')
      const adjustedCur = typeof cur === 'string' ? cur : JSON.stringify(cur, null, 2).replace(keyQuotes, '$1:')

      return `${adjustedMsg} ${adjustedCur}`
    })
  }

  if (typeof message === 'object' && !Array.isArray(message)) {
    adjustedMessage = JSON.stringify(message, null, 2).replace(keyQuotes, '$1:')
  }

  return `${level}: [${label}] ${adjustedMessage}`
}
