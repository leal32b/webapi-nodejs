[ ] sort objects keys ASC
[ ] order: fakes, stubs, SutTypes, makeSut
[ ] makeErrorFake
[ ] errorFake on SutTypes/fakes object
[ ] use errorFake on tests
[ ] makeSut returns { sut, ...injection, ...fakes, ...collaborators }


```typescript
const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeParamsFake = (): Params => ({
  email: 'any@mail.com',
  password: 'password',
})

const makeHasherStub = (): Hasher => ({
  hash: jest.fn(async (): Promise<Either<DomainError, string>> => {
    return right('hashed_password')
  })
})

type SutTypes = {
  sut: Example
  hasher: Hasher
  errorFake: DomainError
  paramsFake: Params
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake(),
    paramsFake: makeParamsFake()
  }
  const injection = {
    hasher: Hasher
  }
  const sut = Example(injection)

  return { sut, ...injection, ...fakes }
}

describe('Example', () => {
  describe('success', () => {
    it('returns true when params are valid', async () => {
      const { sut, hasher, paramsFake } = makeSut()

      const result = await sut.execute(paramsFake)

      expect(result).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Error when hasher fails', async () => {
      const { sut, hasher, errorFake, paramsFake } = makeSut()
      jest.spyOn(hasher, 'hash').mockResolvedValueOnce(
        left(errorFake)
      )

      const result = await sut.execute(paramsFake).value

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
```