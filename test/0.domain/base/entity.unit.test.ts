import Entity from '@/0.domain/base/entity'
import Id from '@/0.domain/value-objects/id'

type SutTypes = {
  sut: typeof Entity
}

const makeSut = (): SutTypes => {
  const sut = Entity

  return { sut }
}

describe('Entity', () => {
  describe('success', () => {
    it('returns an object with params and value-objects if all params are valid', () => {
      const { sut } = makeSut()
      const id = 'any_id'
      type Params = { id: Id }

      const result = sut.validateParams<Params>({
        id: Id.create(id)
      })

      expect(result.value.id).toBeInstanceOf(Id)
    })
  })

  describe('failure', () => {
    it('returns an object with params and errors if any param is invalid', () => {
      const { sut } = makeSut()
      const id = null
      type Params = { id: Id }

      const result = sut.validateParams<Params>({
        id: Id.create(id)
      })

      expect(result.value.id[0]).toBeInstanceOf(Error)
    })
  })
})
