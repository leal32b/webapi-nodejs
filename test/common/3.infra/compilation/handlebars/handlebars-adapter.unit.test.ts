import fs from 'fs'

import Handlebars from 'handlebars'

import { type DomainError } from '@/common/0.domain/base/domain-error'
import { ServerError } from '@/common/2.presentation/errors/server-error'
import { HandlebarsAdapter } from '@/common/3.infra/compilation/handlebars/handlebars-adapter'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'

vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn().mockReturnValue('<html><body>value is: {{value}}</body></html>')
  }
}))

vi.mock('handlebars', () => ({
  default: {
    compile: () => {
      return () => '<html><body>any_value</body></html>'
    },
    registerHelper: vi.fn()
  }
}))

type SutTypes = {
  errorFake: DomainError
  sut: HandlebarsAdapter
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake()
  }
  const sut = HandlebarsAdapter.create()

  return {
    ...doubles,
    sut
  }
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

    it('returns Right with compiled template on Handlebars.compile when it succeeds', async () => {
      const { sut } = makeSut()
      const templateName = 'test'
      const context = { value: 'any_value' }

      const result = sut.compile(templateName, context)

      expect(result.isRight()).toBe(true)
      expect(result.value).toEqual(expect.any(String))
    })

    it('calls Handlebars.registerHelper with correct params', async () => {
      const { sut } = makeSut()
      const registerHelperSpy = vi.spyOn(Handlebars, 'registerHelper')
      const name = 'any_name'
      const helper = (value: number): string => (value * 2).toString()

      await sut.registerHelper(name, helper)

      expect(registerHelperSpy).toHaveBeenCalledWith('any_name', helper)
    })

    it('returns Right on Handlebars.register when it succeeds', async () => {
      const { sut } = makeSut()
      const name = 'any_name'
      const helper = (value: number): string => (value * 2).toString()
      const result = sut.registerHelper(name, helper)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left with ServerError when source is not found', () => {
      const { sut } = makeSut()
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(undefined)
      const templateName = 'test'
      const context = { value: 'any_value' }

      const result = sut.compile(templateName, context)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when Handlebars.compile throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(Handlebars, 'compile').mockImplementationOnce(() => { throw new Error() })
      const templateName = 'test'
      const context = { value: 'any_value' }

      const result = sut.compile(templateName, context)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when Handlebars.registerHelper throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(Handlebars, 'registerHelper').mockImplementationOnce(() => { throw new Error() })

      const result = sut.registerHelper('helper', (value: number) => (value * 2).toString())

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })
  })
})
