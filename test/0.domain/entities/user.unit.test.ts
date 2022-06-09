import User, { CreateParams } from '@/0.domain/entities/user'

const makeParamsFake = (): CreateParams => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any@mail.com',
  password: 'password'
})

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

      const result = sut.create(makeParamsFake())

      expect(result.value).toBeInstanceOf(User)
    })
  })

  describe('failure', () => {
    it('returns left with params errors when any param is invalid', () => {
      const { sut } = makeSut()
      const id = null

      const result = sut.create({ ...makeParamsFake(), id })

      expect(result.isLeft()).toBeTruthy()
    })

    it('returns an object with param errors for all invalid params', () => {
      const { sut } = makeSut()
      const id = null
      const name = null

      const result = sut.create({ ...makeParamsFake(), id, name })

      expect(Object.keys(result.value)).toEqual(
        expect.arrayContaining(['id', 'name'])
      )
    })
  })
})
