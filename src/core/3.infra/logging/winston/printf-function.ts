type Params = {
  label: string
  level: string
  message: string | string[] | Record<string, unknown>
}

export const printfFunction = ({ level, label, message }: Params): string => {
  if (typeof message !== 'string') {
    message = JSON.stringify(message)
  }

  return `[${label}] ${level}: ${message}`
}
