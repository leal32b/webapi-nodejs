import { ServerError } from '@/2.presentation/errors/server-error'

type SutTypes = {
  sut: typeof ServerError
}

const makeSut = (): SutTypes => {
  const sut = ServerError

  return { sut }
}

describe('ServerError', () => {
  describe('success', () => {
    it('returns a ServerError', () => {
      const { sut } = makeSut()
      const message = 'any_message'
      const stack = 'any_stack'

      const result = new sut(message, stack)

      expect(result).toBeInstanceOf(ServerError)
    })

    it('returns an ServerError with correct message', () => {
      const { sut } = makeSut()
      const message = 'any_message'
      const stack = 'any_stack'

      const result = new sut(message, stack)

      expect(result.props.message).toBe('any_message')
    })
  })
})
