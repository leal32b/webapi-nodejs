import User from '@/0.domain/entities/user'

const fakeParams = {
  id: 'any_id',
  email: 'any@mail.com',
  name: 'any_name',
  password: 'any_password'
}

type SutTypes = {
  sut: typeof User
}

const makeSut = (): SutTypes => {
  const sut = User

  return { sut }
}

describe('User', () => {
  describe('success', () => {
    it('returns an User if params are valid', () => {
      const { sut } = makeSut()

      const result = sut.create(fakeParams)

      expect(result.value).toBeInstanceOf(User)
    })
  })

  describe('failure', () => {
    it('returns left with params errors when any param is invalid', () => {
      const { sut } = makeSut()
      const id = null

      const result = sut.create({ ...fakeParams, id })

      expect(result.isLeft()).toBeTruthy()
    })

    it('returns an object with param errors for all invalid params', () => {
      const { sut } = makeSut()
      const id = null
      const name = null

      const result = sut.create({ ...fakeParams, id, name })

      expect(Object.keys(result.value)).toEqual(
        expect.arrayContaining(['id', 'name'])
      )
    })
  })
})
