import fs from 'fs'

import Handlebars from 'handlebars'

import { DomainError } from '@/core/0.domain/base/domain-error'
import { HandlebarsAdapter } from '@/core/3.infra/compilers/handlebars/handlebars-adapter'

import { makeErrorFake } from '~/core/fakes/error-fake'

vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn().mockReturnValue('<html><body>value is: {{value}}</body></html>')
  }
}))

type SutTypes = {
  sut: HandlebarsAdapter
  errorFake: DomainError
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake()
  }
  const sut = HandlebarsAdapter.create()

  return { sut, ...doubles }
}

describe('HandlebarsAdapter', () => {
  describe('success', () => {
    it('calls Handlebars.compile with correct params', async () => {
      const { sut } = makeSut()
      const compileSpy = vi.spyOn(Handlebars, 'compile')
      const templateName = 'test'
      const context = { value: 'any_value' }

      await sut.compile(templateName, context)

      expect(compileSpy).toHaveBeenCalledWith('<html><body>value is: {{value}}</body></html>')
    })

    it('returns Right on Handlebars.compile when it succeeds', async () => {
      const { sut } = makeSut()
      const templateName = 'test'
      const context = { value: 'any_value' }

      const result = sut.compile(templateName, context)

      expect(result.isRight()).toBe(true)
    })

    it('returns a compiled template', () => {
      const { sut } = makeSut()
      const templateName = 'test'
      const context = { value: 'any_value' }

      const result = sut.compile(templateName, context)

      expect(result.value).toBe('<html><body>value is: any_value</body></html>')
    })

    it('returns Right on Handlebars.register when it succeeds', async () => {
      const { sut } = makeSut()
      sut.registerHelper('helper', (value: number) => (value * 2).toString())
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce('<html><body>{{helper 1}}</body></html>')
      const templateName = 'test'

      const result = await sut.compile(templateName)

      expect(result.isRight()).toBe(true)
    })

    it('executes a helper', async () => {
      const { sut } = makeSut()
      sut.registerHelper('helper', (value: number) => (value * 2).toString())
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce('<html><body>{{helper 1}}</body></html>')
      const templateName = 'test'

      const result = await sut.compile(templateName)

      expect(result.value).toBe('<html><body>2</body></html>')
    })
  })

  describe('failure', () => {
    it('returns Left when source is not found', () => {
      const { sut } = makeSut()
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(undefined)
      const templateName = 'test'
      const context = { value: 'any_value' }

      const result = sut.compile(templateName, context)

      expect(result.isLeft()).toBe(true)
    })

    it('returns an error when source is not found', async () => {
      const { sut } = makeSut()
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(undefined)
      const templateName = 'test'
      const context = { value: 'any_value' }

      const result = sut.compile(templateName, context)

      expect(result.value).toBeInstanceOf(DomainError)
    })

    it('returns Left when Handlebars.compile throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(Handlebars, 'compile').mockImplementationOnce(() => { throw new Error() })
      const templateName = 'test'
      const context = { value: 'any_value' }

      const result = sut.compile(templateName, context)

      expect(result.isLeft()).toBe(true)
    })

    it('returns an error when Handlebars.compile throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(Handlebars, 'compile').mockImplementationOnce(() => { throw new Error() })
      const templateName = 'test'
      const context = { value: 'any_value' }

      const result = sut.compile(templateName, context)

      expect(result.value).toBeInstanceOf(DomainError)
    })

    it('returns Left when Handlebars.registerHelper throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(Handlebars, 'registerHelper').mockImplementationOnce(() => { throw new Error() })

      const result = sut.registerHelper('helper', (value: number) => (value * 2).toString())

      expect(result.isLeft()).toBe(true)
    })

    it('returns an error when Handlebars.registerHelper throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(Handlebars, 'registerHelper').mockImplementationOnce(() => { throw new Error() })

      const result = sut.registerHelper('helper', (value: number) => (value * 2).toString())

      expect(result.value).toBeInstanceOf(DomainError)
    })
  })
})
