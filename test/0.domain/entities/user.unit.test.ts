import DomainError from '@/0.domain/base/domain-error'
import User, { CreateParams } from '@/0.domain/entities/user/user'

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
    it('returns an User when params are valid', () => {
      const { sut } = makeSut()

      const result = sut.create(makeParamsFake())

      expect(result.value).toBeInstanceOf(User)
    })
  })

  describe('failure', () => {
    it('returns Left when any param is invalid', () => {
      const { sut } = makeSut()
      const email = null

      const result = sut.create({ ...makeParamsFake(), email })

      expect(result.isLeft()).toBeTruthy()
    })

    it('returns Errors when any param is invalid', () => {
      const { sut } = makeSut()
      const email = null

      const result = sut.create({ ...makeParamsFake(), email })

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an object with param Errors for all invalid params', () => {
      const { sut } = makeSut()
      const email = null
      const name = null

      const result = sut.create({ ...makeParamsFake(), email, name })

      expect((result.value as any).map(error => error.props.field)).toEqual(
        expect.arrayContaining(['Email', 'Name'])
      )
    })
  })
})
