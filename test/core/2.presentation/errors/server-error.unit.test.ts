import { ServerError } from '@/core/2.presentation/errors/server-error'

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

      const result = sut.create(message, stack)

      expect(result).toBeInstanceOf(ServerError)
    })

    it('returns props with correct values', () => {
      const { sut } = makeSut()
      const message = 'any_message'
      const stack = 'any_stack'

      const result = sut.create(message, stack)

      expect(result.props).toEqual({
        message: 'any_message',
        stack: 'any_stack'
      })
    })
  })
})
