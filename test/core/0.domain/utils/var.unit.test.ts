import { getIntVar, getVar, setVar } from '@/core/0.domain/utils/var'

describe('Var', () => {
  describe('success', () => {
    it('sets environment variable', () => {
      const varName = 'ANY_VAR'
      const value = 'any_value'

      setVar(varName, value)

      expect(process.env.ANY_VAR).toBe('any_value')
    })

    it('gets environment variable', () => {
      const varName = 'ANY_VAR2'
      const value = 'any_value2'
      process.env[varName] = value

      const result = getVar(varName)

      expect(result).toBe('any_value2')
    })

    it('gets environment variable as int', () => {
      const varName = 'ANY_VAR3'
      const value = 1
      process.env[varName] = value.toString()

      const result = getIntVar(varName)

      expect(result).toBe(1)
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

    it('returns undefined on getVar when variable do not exist', async () => {
      const varName = 'NOT_EXISTING_VAR'

      const result = getVar(varName)

      expect(result).toBe(undefined)
    })

    it('logs an error message on getVar when variable do not exist', async () => {
      const varName = 'NOT_EXISTING_VAR'
      const logSpy = vi.spyOn(console, 'error')

      getVar(varName)

      expect(logSpy).toHaveBeenCalledWith("Environment variable 'NOT_EXISTING_VAR' not found!")
    })

    it('returns undefined on getIntVar when variable do not exist', async () => {
      const varName = 'NOT_EXISTING_VAR'

      const result = getIntVar(varName)

      expect(result).toBe(undefined)
    })

    it('logs an error message on getIntVar when variable do not exist', async () => {
      const varName = 'NOT_EXISTING_VAR'
      const logSpy = vi.spyOn(console, 'error')

      getIntVar(varName)

      expect(logSpy).toHaveBeenCalledWith("Environment variable 'NOT_EXISTING_VAR' not found!")
    })
  })
})
