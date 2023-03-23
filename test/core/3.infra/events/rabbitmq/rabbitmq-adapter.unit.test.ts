import amqplib from 'amqplib/callback_api'

import { RabbitmqAdapter } from '@/core/3.infra/events/rabbitmq/rabbitmq-adapter'

vi.mock('amqplib/callback_api', () => ({
  default: {
    connect: (host, fn) => {
      fn(null, {
        createChannel: fn2 => {
          fn2(null, { assertQueue: vi.fn() })
        }
      })
    }
  }
}))

type SutTypes = {
  sut: RabbitmqAdapter
}

const makeSut = (): SutTypes => {
  const params = {
    host: 'any_host'
  }

  const sut = RabbitmqAdapter.create(params)

  return { sut, ...params }
}

describe('RabbitmqClient', () => {
  describe('success', () => {
    it('calls amqplib.connect with correct params', async () => {
      const { sut } = makeSut()
      const connectSpy = vi.spyOn(amqplib, 'connect')

      sut.connect()

      expect(connectSpy).toHaveBeenCalledWith('any_host', expect.any(Function))
    })

    it('connects to rabbitmq server', () => {
      const { sut } = makeSut()

      const result = sut.connect()

      expect(result.isRight()).toBe(true)
    })

    it('calls amqplib.createChannel with correct params', async () => {
      const { sut } = makeSut()
      const createChannelSpy = vi.fn()
      vi.spyOn(amqplib, 'connect').mockImplementationOnce((host, fn) => {
        fn(null, { createChannel: createChannelSpy })
      })
      sut.connect()

      sut.createChannel()

      expect(createChannelSpy).toHaveBeenCalledWith(expect.any(Function))
    })

    it('creates a channel', async () => {
      const { sut } = makeSut()
      sut.connect()

      const result = sut.createChannel()

      expect(result.isRight()).toBe(true)
    })

    it('calls amqplib.assertQueue with correct params', async () => {
      const { sut } = makeSut()
      const assertQueueSpy = vi.fn()
      vi.spyOn(amqplib, 'connect').mockImplementationOnce((host, fn) => {
        fn(null, {
          createChannel: (fn2) => {
            fn2(null, { assertQueue: assertQueueSpy })
          }
        })
      })
      const name = 'any_queue'
      sut.connect()
      sut.createChannel()

      sut.createQueue(name)

      expect(assertQueueSpy).toHaveBeenCalledWith('any_queue', expect.any(Object))
    })

    it('creates a queue', async () => {
      const { sut } = makeSut()
      const name = 'any_queue'
      sut.connect()
      sut.createChannel()

      const result = sut.createQueue(name)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when amqplib.connect throws', () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockImplementationOnce(() => { throw new Error() })

      const result = sut.connect()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when amqplib.connect returns an error', () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockImplementationOnce((host, fn) => {
        fn(new Error(), null)
      })

      const result = sut.connect()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when amqplib.createChannel throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockImplementationOnce((host, fn) => {
        fn(null, { createChannel: () => { throw new Error() } })
      })
      sut.connect()

      const result = sut.createChannel()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when amqplib.createChannel returns an error', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockImplementationOnce((host, fn) => {
        fn(null, { createChannel: (fn) => { fn(new Error(), null) } })
      })
      sut.connect()

      const result = sut.createChannel()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when amqplib.assertQueue throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockImplementationOnce((host, fn) => {
        fn(null, {
          createChannel: fn2 => {
            fn2(null, { assertQueue: () => { throw new Error() } })
          }
        })
      })
      const name = 'any_queue'
      sut.connect()
      sut.createChannel()

      const result = sut.createQueue(name)

      expect(result.isLeft()).toBe(true)
    })
  })
})
