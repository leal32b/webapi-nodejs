export const setVar = (varName: string, value: string): void => {
  if (!varName) {
    console.log(`Invalid environment variable name: ${varName}`)

    return
  }

  if (!value) {
    console.log(`Invalid environment variable value: ${value}`)

    return
  }

  process.env[varName] = value
}

export const getVar = (varName: string): string => {
  const varValue = process.env[varName]

  if (!varValue) {
    console.log(`Environment variable '${varName}' not found!`)

    return undefined
  }

  return varValue
}

export const getIntVar = (varName: string): number => {
  const varValue = process.env[varName]

  if (!varValue) {
    console.log(`Environment variable '${varName}' not found!`)

    return undefined
  }

  return parseInt(varValue)
}
