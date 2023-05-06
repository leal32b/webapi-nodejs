import { getBooleanVar, getIntVar, getVar, setVar } from '@/common/0.domain/utils/var'

describe('Var', () => {
  describe('success', () => {
    it('sets an environment variable', () => {
      const varName = 'ANY_VAR'
      const value = 'any_value'

      setVar(varName, value)

      expect(process.env.ANY_VAR).toBe('any_value')
    })

    it('gets an environment variable', () => {
      const varName = 'ANY_VAR2'
      const value = 'any_value2'
      process.env[varName] = value

      const result = getVar(varName)

      expect(result).toBe('any_value2')
    })

    it('gets an environment variable as int', () => {
      const varName = 'ANY_VAR3'
      const value = 1
      process.env[varName] = value.toString()

      const result = getIntVar(varName)

      expect(result).toBe(1)
    })

    it('gets an environment variable as boolean', () => {
      const varName = 'ANY_VAR4'
      const value = true
      process.env[varName] = value.toString()

      const result = getBooleanVar(varName)

      expect(result).toBe(true)
    })
  })

  describe('failure', () => {
    it('logs an error message on setVar when variable name is invalid', async () => {
      const varName = null
      const value = 'any_value'
      const logSpy = vi.spyOn(console, 'error')

      setVar(varName, value)

      expect(logSpy).toHaveBeenCalledWith('Invalid environment variable name: null')
    })

    it('logs an error message on setVar when variable value is invalid', async () => {
      const varName = 'ANY_VAR'
      const value = null
      const logSpy = vi.spyOn(console, 'error')

      setVar(varName, value)

      expect(logSpy).toHaveBeenCalledWith('Invalid environment variable value: null')
    })

    it('returns undefined and logs an error message on getVar when variable does not exist', async () => {
      const varName = 'NOT_EXISTING_VAR'
      const logSpy = vi.spyOn(console, 'error')

      const result = getVar(varName)

      expect(result).toBe(undefined)
      expect(logSpy).toHaveBeenCalledWith("Environment variable 'NOT_EXISTING_VAR' not found!")
    })

    it('returns undefined and logs an error message on getIntVar when variable does not exist', async () => {
      const varName = 'NOT_EXISTING_VAR'
      const logSpy = vi.spyOn(console, 'error')

      const result = getIntVar(varName)

      expect(result).toBe(undefined)
      expect(logSpy).toHaveBeenCalledWith("Environment variable 'NOT_EXISTING_VAR' not found!")
    })

    it('returns undefined and logs an error message on getBooleanVar when variable does not exist', async () => {
      const varName = 'NOT_EXISTING_VAR'
      const logSpy = vi.spyOn(console, 'error')

      const result = getBooleanVar(varName)

      expect(result).toBe(undefined)
      expect(logSpy).toHaveBeenCalledWith("Environment variable 'NOT_EXISTING_VAR' not found!")
    })

    it('returns undefined and logs an error message on getBooleanVar when variable is not boolean', async () => {
      const varName = 'NOT_BOOLEAN_VAR'
      const logSpy = vi.spyOn(console, 'error')
      const value = 'not_boolean_value'
      process.env[varName] = value.toString()

      const result = getBooleanVar(varName)

      expect(result).toBe(undefined)
      expect(logSpy).toHaveBeenCalledWith("Environment variable 'NOT_BOOLEAN_VAR' is not boolean!")
    })
  })
})
