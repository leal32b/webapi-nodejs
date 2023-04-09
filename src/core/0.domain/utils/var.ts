export const setVar = (varName: string, value: string): void => {
  if (!varName) {
    console.error(`Invalid environment variable name: ${varName}`)

    return
  }

  if (!value) {
    console.error(`Invalid environment variable value: ${value}`)

    return
  }

  process.env[varName] = value
}

export const getVar = (varName: string): string => {
  const varValue = process.env[varName]

  if (!varValue) {
    console.error(`Environment variable '${varName}' not found!`)

    return undefined
  }

  return varValue
}

export const getIntVar = (varName: string): number => {
  const varValue = process.env[varName]

  if (!varValue) {
    console.error(`Environment variable '${varName}' not found!`)

    return undefined
  }

  return parseInt(varValue)
}

export const getBooleanVar = (varName: string): boolean => {
  const varValue = process.env[varName]

  if (!varValue) {
    console.error(`Environment variable '${varName}' not found!`)

    return undefined
  }

  try {
    return JSON.parse(varValue)
  } catch (error) {
    console.error(`Environment variable '${varName}' is not boolean!`)

    return undefined
  }
}
