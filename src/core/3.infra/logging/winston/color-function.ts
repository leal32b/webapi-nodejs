const RESET = '\x1b[0m'

const colors = {
  blue: (input: string): string => '\x1b[34m' + input + RESET,
  cyan: (input: string): string => '\x1b[36m' + input + RESET,
  magenta: (input: string): string => '\x1b[35m' + input + RESET,
  yellow: (input: string): string => '\x1b[33m' + input + RESET
}

const labels = {
  communication: colors.yellow,
  dataSource: colors.cyan,
  events: colors.blue,
  webapp: colors.magenta
}

export const colorFunction = (label: string): string => {
  try {
    return labels[label](label)
  } catch (error) {
    return label
  }
}
