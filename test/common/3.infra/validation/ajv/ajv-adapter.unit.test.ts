import Ajv from 'ajv'

import { DomainError } from '@/common/0.domain/base/domain-error'
import { AjvAdapter } from '@/common/3.infra/validation/ajv/ajv-adapter'

vi.mock('ajv', () => ({
  default: vi.fn(() => ({
    compile: vi.fn(() => vi.fn(() => true))
  }))
}))

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

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake()
  }
  const sut = AjvAdapter.create()

  return { sut, ...doubles }
}

describe('AjvAdapter', () => {
  describe('success', () => {
    it('calls ajv.compile with correct params', async () => {
      const { sut } = makeSut()
      const schema = {}
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }
      const compile = vi.fn()
      vi.mocked(Ajv).mockImplementationOnce(() => ({ compile } as any))

      await sut.validate(fakeRequest, schema)

      expect(compile).toHaveBeenCalledWith({})
    })

    it('calls ajv.validate with correct params', async () => {
      const { sut } = makeSut()
      const schema = {}
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }
      const validate = vi.fn()
      vi.mocked(Ajv).mockImplementationOnce(() => ({
        compile: vi.fn(() => validate)
      } as any))

      await sut.validate(fakeRequest, schema)

      expect(validate).toHaveBeenCalledWith({ anyKey: 'any_value' })
    })

    it('returns Right with isValid=true when schema is successfully validated', async () => {
      const { sut } = makeSut()
      const schema = {
        additionalProperties: false,
        properties: {
          anyKey: { type: 'string' }
        },
        required: ['anyKey'],
        type: 'object'
      }
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }

      const result = await sut.validate(fakeRequest, schema)

      expect(result.isRight()).toBe(true)
      expect(result.value).toEqual({ isValid: true })
    })

    it('returns Right with isValid=false and errors when schema is invalid', async () => {
      const { sut } = makeSut()
      const schema = {
        additionalProperties: false,
        properties: {
          anyKey: { type: 'number' }
        },
        required: ['anyKey'],
        type: 'object'
      }
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }
      vi.mocked(Ajv).mockImplementationOnce(() => ({
        compile: vi.fn(() => {
          const validate = (): boolean => false
          validate.errors = [{
            instancePath: '/anyKey',
            keyword: 'type',
            message: 'must be number',
            params: {
              type: 'number'
            },
            schemaPath: '#/properties/anyKey/type'
          }]

          return validate
        })
      } as any))

      const result = await sut.validate(fakeRequest, schema)

      expect(result.isRight()).toBe(true)
      expect(result.value).toEqual({
        errors: [{
          instancePath: '/anyKey',
          keyword: 'type',
          message: 'must be number',
          params: {
            type: 'number'
          },
          schemaPath: '#/properties/anyKey/type'
        }],
        isValid: false
      })
    })
  })

  describe('failure', () => {
    it('returns Left with Error when compile throws', async () => {
      const { sut } = makeSut()
      const schema = {}
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }
      const compile = vi.fn(() => { throw new Error() })
      vi.mocked(Ajv).mockImplementationOnce(() => ({ compile } as any))

      const result = await sut.validate(fakeRequest, schema)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(Error)
    })

    it('returns Left with Error when validate throws', async () => {
      const { sut } = makeSut()
      const schema = {}
      const fakeRequest = {
        payload: { anyKey: 'any_value' }
      }
      const validate = vi.fn(() => { throw new Error() })
      vi.mocked(Ajv).mockImplementationOnce(() => ({
        compile: validate
      } as any))

      const result = await sut.validate(fakeRequest, schema)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(Error)
    })
  })
})
