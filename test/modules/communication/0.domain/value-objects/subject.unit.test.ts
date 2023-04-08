import { Subject } from '@/communication/0.domain/value-objects/subject'
import { MaxLengthError } from '@/core/0.domain/errors/max-length-error'
import { MinLengthError } from '@/core/0.domain/errors/min-length-error'

type SutTypes = {
  sut: typeof Subject
}

const makeSut = (): SutTypes => {
  const sut = Subject

  return { sut }
}

describe('Subject', () => {
  describe('success', () => {
    it('returns Subject when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_subject'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Subject)
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
      const input = 'input_that_exceeds_subject_max_length_of_sixty_four_characters___'

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(MaxLengthError)
    })
  })
})
