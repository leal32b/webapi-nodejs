export const setVar = (env: string, value: string): void => {
  process.env[env] = value
}

export const getVar = (env: string): string => process.env[env]
