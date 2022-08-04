import { MaxLengthError } from '@/core/0.domain/errors/max-length-error'
import { MinLengthError } from '@/core/0.domain/errors/min-length-error'
import { Name } from '@/modules/user/0.domain/value-objects/name'

type SutTypes = {
  sut: typeof Name
}

const makeSut = (): SutTypes => {
  const sut = Name

  return { sut }
}

describe('Name', () => {
  describe('success', () => {
    it('returns an Name when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_name'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Name)
    })
  })

  describe('failure', () => {
    it('returns MinLengthError when input.length is lower than minLength', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(MinLengthError)
    })

    it('returns MaxLengthError when input.length is higher than maxLength', () => {
      const { sut } = makeSut()
      const input = 'input_that_exceeds_name_max_length_of_thirty_two_characters'

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(MaxLengthError)
    })
  })
})
