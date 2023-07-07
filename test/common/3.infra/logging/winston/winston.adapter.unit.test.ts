import winston from 'winston'

import { printfFunction } from '@/common/3.infra/logging/winston/printf-function'
import { WinstonAdapter } from '@/common/3.infra/logging/winston/winston.adapter'

vi.mock('winston', () => ({
  default: {
    createLogger: vi.fn(() => ({
      error: vi.fn(),
      info: vi.fn()
    }))
  },
  format: {
    colorize: vi.fn(),
    combine: vi.fn(),
    printf: vi.fn()
  },
  transports: {
    Console: vi.fn()
  }
}))

type SutTypes = {
  sut: WinstonAdapter
}

const makeSut = (): SutTypes => {
  const params = {
    printfFunction
  }
  const sut = WinstonAdapter.create(params)

  return { sut }
}

describe('WinstonAdapter', () => {
  describe('success', () => {
    it('calls logger.error with correct params', () => {
      const error = vi.fn()
      vi.mocked(winston).createLogger.mockImplementationOnce(() => ({ error } as any))
      const { sut } = makeSut()

      sut.error('any_label', 'any_message')

      expect(error).toHaveBeenCalledWith({ label: 'any_label', message: 'any_message' })
    })

    it('calls logger.info with correct params', () => {
      const info = vi.fn()
      vi.mocked(winston).createLogger.mockImplementationOnce(() => ({ info } as any))
      const { sut } = makeSut()

      sut.info('any_label', ['any_message'])

      expect(info).toHaveBeenCalledWith({ label: 'any_label', message: ['any_message'] })
    })
  })
})
