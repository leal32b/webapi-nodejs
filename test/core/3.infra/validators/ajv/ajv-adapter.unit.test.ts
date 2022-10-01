/* eslint-disable @typescript-eslint/no-var-requires */
import { DomainError } from '@/core/0.domain/base/domain-error'
import { AjvAdapter } from '@/core/3.infra/validators/ajv/ajv-adapter'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

type SutTypes = {
  sut: AjvAdapter
  errorFake: DomainError
}

type SutMockedTypes = SutTypes & {
  compile: jest.Mock
  validate: jest.Mock
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake()
  }
  const sut = new AjvAdapter()

  return { sut, ...doubles }
}

const makeSutMocked = (): SutMockedTypes => {
  const validate = jest.fn()
  const compile = jest.fn(() => validate)
  const fakes = {
    errorFake: makeErrorFake(),
    compile,
    validate
  }
  jest.mock('ajv', () => jest.fn().mockImplementation(() => ({ compile })))
  const { AjvAdapter } = require('@/core/3.infra/validators/ajv/ajv-adapter')
  const sut = new AjvAdapter()

  return { sut, ...fakes }
}

describe('AjvAdapter', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  describe('success', () => {
    it('calls ajv.compile with correct params', async () => {
      const { sut, compile } = makeSutMocked()
      const schema = 'any_schema'
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }

      await sut.validate(fakeRequest, schema)

      expect(compile).toHaveBeenCalledWith('any_schema')
    })

    it('calls ajv.validate with correct params', async () => {
      const { sut, validate } = makeSutMocked()
      const schema = 'any_schema'
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }

      await sut.validate(fakeRequest, schema)

      expect(validate).toHaveBeenCalledWith({ anyKey: 'any_value' })
    })

    it('returns Right when schema is successfully validated', async () => {
      const { sut } = makeSut()
      const schema = {
        type: 'object',
        properties: {
          anyKey: { type: 'string' }
        },
        required: ['anyKey'],
        additionalProperties: false
      }
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.validate(fakeRequest, schema)

      expect(result.isRight()).toBe(true)
    })

    it('returns isValid=true when schema is valid', async () => {
      const { sut } = makeSut()
      const schema = {
        type: 'object',
        properties: {
          anyKey: { type: 'string' }
        },
        required: ['anyKey'],
        additionalProperties: false
      }
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.validate(fakeRequest, schema)

      expect(result.value).toEqual({
        isValid: true
      })
    })

    it('returns isValid=false and errors when schema is invalid', async () => {
      const { sut } = makeSut()
      const schema = {
        type: 'object',
        properties: {
          anyKey: { type: 'number' }
        },
        required: ['anyKey'],
        additionalProperties: false
      }
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.validate(fakeRequest, schema)

      expect(result.value).toEqual({
        isValid: false,
        errors: [{
          instancePath: '/anyKey',
          keyword: 'type',
          message: 'must be number',
          params: {
            type: 'number'
          },
          schemaPath: '#/properties/anyKey/type'
        }]
      })
    })
  })

  describe('failure', () => {
    it('returns Left when compile throws', async () => {
      const { sut, compile } = makeSutMocked()
      compile.mockImplementation(() => { throw new Error() })
      const schema = 'any_schema'
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.validate(fakeRequest, schema)

      expect(result.isLeft()).toBe(true)
    })

    it('returns an error when compile throws', async () => {
      const { sut, compile } = makeSutMocked()
      compile.mockImplementation(() => { throw new Error() })
      const schema = 'any_schema'
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.validate(fakeRequest, schema)

      expect(result.value).toBeInstanceOf(Error)
    })

    it('returns Left when validate throws', async () => {
      const { sut, validate } = makeSutMocked()
      validate.mockImplementation(() => { throw new Error() })
      const schema = 'any_schema'
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.validate(fakeRequest, schema)

      expect(result.isLeft()).toBe(true)
    })

    it('returns an error when validate throws', async () => {
      const { sut, validate } = makeSutMocked()
      validate.mockImplementation(() => { throw new Error() })
      const schema = 'any_schema'
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.validate(fakeRequest, schema)

      expect(result.value).toBeInstanceOf(Error)
    })
  })
})
