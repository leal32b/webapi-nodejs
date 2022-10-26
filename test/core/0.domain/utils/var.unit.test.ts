import { getVar, setVar } from '@/core/0.domain/utils/var'

describe('Var', () => {
  describe('success', () => {
    it('sets environment variable', () => {
      const varName = 'ANY_VAR'
      const varValue = 'any_value'

      setVar(varName, varValue)

      expect(process.env.ANY_VAR).toBe('any_value')
    })

    it('gets environment variable', () => {
      const varName = 'ANY_VAR2'
      const varValue = 'any_value2'
      process.env[varName] = varValue

      const result = getVar(varName)

      expect(result).toBe('any_value2')
    })
  })
})
