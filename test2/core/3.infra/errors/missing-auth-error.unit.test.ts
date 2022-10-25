import { MissingAuthError } from '@/core/3.infra/errors/missing-auth-error'

type SutTypes = {
  sut: typeof MissingAuthError
}

const makeSut = (): SutTypes => {
  const sut = MissingAuthError

  return { sut }
}

describe('MissingAuthError', () => {
  describe('success', () => {
    it('returns a MissingAuthError', () => {
      const { sut } = makeSut()
      const auth = ['any']

      const result = new sut(auth)

      expect(result).toBeInstanceOf(MissingAuthError)
    })

    it('returns props with correct values', () => {
      const { sut } = makeSut()
      const auth = ['any']

      const result = new sut(auth)

      expect(result.props).toEqual({
        message: 'user must have at least one of these permissions: any'
      })
    })
  })
})
