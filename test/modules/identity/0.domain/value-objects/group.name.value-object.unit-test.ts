import { MaxLengthError } from '@/common/0.domain/errors/max-length.error'
import { MinLengthError } from '@/common/0.domain/errors/min-length.error'

import { GroupName } from '@/identity/0.domain/value-objects/group.name.value-object'

type SutTypes = {
  sut: typeof GroupName
}

const makeSut = (): SutTypes => {
  const sut = GroupName

  return { sut }
}

describe('GroupName', () => {
  describe('success', () => {
    it('returns GroupName when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_name'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(GroupName)
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
      const input = 'input_that_exceeds_name_max_length_of_twenty_four_characters'

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(MaxLengthError)
    })
  })
})
