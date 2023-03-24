import amqplib from 'amqplib'

import { left, right } from '@/core/0.domain/utils/either'
import { type Logger } from '@/core/1.application/logging/logger'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { RabbitmqAdapter } from '@/core/3.infra/events/rabbitmq/rabbitmq-adapter'

import { makeLoggerMock } from '~/core/mocks/logger-mock'

vi.mock('amqplib', () => ({
  default: {
    connect: () => ({
      createChannel: () => ({
        ack: vi.fn(),
        assertQueue: vi.fn(),
        consume: (queue, fn) => fn({
          content: Buffer.from(JSON.stringify({}))
        }),
        sendToQueue: () => true
      })
    })
  }
}))

type SutTypes = {
  sut: RabbitmqAdapter
  connectParams: Record<string, unknown>
  logger: Logger
}

const makeSut = (): SutTypes => {
  const params = {
    connectParams: {
      hostname: 'any_host',
      password: 'any_password',
      port: 0,
      username: 'any_user'
    },
    logger: makeLoggerMock()
  }
  const sut = RabbitmqAdapter.create(params)

  return { sut, ...params }
}

describe('RabbitmqClient', () => {
  describe('success', () => {
    it('calls amqplib.connect with correct params', async () => {
      const { sut } = makeSut()
      const connectSpy = vi.spyOn(amqplib, 'connect')

      await sut.connect()

      expect(connectSpy).toHaveBeenCalledWith({
        hostname: 'any_host',
        password: 'any_password',
        port: 0,
        username: 'any_user'
      })
    })

    it('connects to rabbitmq server', async () => {
      const { sut } = makeSut()

      const result = await sut.connect()

      expect(result.isRight()).toBe(true)
    })

    it('calls connection.createChannel with correct params', async () => {
      const { sut } = makeSut()
      const createChannelSpy = vi.fn()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({ createChannel: createChannelSpy } as any)

      await sut.connect()

      expect(createChannelSpy).toHaveBeenCalledOnce()
    })

    it('calls channel.assertQueue with correct params', async () => {
      const { sut } = makeSut()
      const assertQueueSpy = vi.fn()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          assertQueue: assertQueueSpy
        })
      } as any)
      const queue = { name: 'any_queue' }
      await sut.connect()

      sut.createQueue(queue)

      expect(assertQueueSpy).toHaveBeenCalledWith('any_queue', expect.any(Object))
    })

    it('creates a queue', async () => {
      const { sut } = makeSut()
      const queue = { name: 'any_queue' }
      await sut.connect()

      const result = sut.createQueue(queue)

      expect(result.isRight()).toBe(true)
    })

    it('calls channel.sendToQueue with correct params', async () => {
      const { sut } = makeSut()
      const sendToQueueSpy = vi.fn()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          sendToQueue: sendToQueueSpy
        })
      } as any)
      const queue = { name: 'any_queue' }
      await sut.connect()

      await sut.publishToQueue(queue, {
        aggregateId: 'any_id',
        createdAt: new Date(),
        payload: {
          anyKey: 'any_value'
        }
      } as any)

      expect(sendToQueueSpy).toHaveBeenCalledWith('any_queue', expect.any(Buffer))
    })

    it('publishes to queue', async () => {
      const { sut } = makeSut()
      const queue = { name: 'any_queue' }
      await sut.connect()
      sut.createQueue(queue)

      const result = await sut.publishToQueue(queue, {
        aggregateId: 'any_id',
        createdAt: new Date(),
        payload: {
          anyKey: 'any_value'
        }
      } as any)

      expect(result.isRight()).toBe(true)
    })

    it('calls channel.consume with correct params', async () => {
      const { sut } = makeSut()
      const consumeSpy = vi.fn()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          consume: consumeSpy,
          sendToQueue: vi.fn()
        })
      } as any)
      const queue = { name: 'any_queue' }
      await sut.connect()

      await sut.subscribeToQueue(queue, vi.fn())

      expect(consumeSpy).toHaveBeenCalledWith('any_queue', expect.any(Function))
    })

    it('subscribes to queue', async () => {
      const { sut } = makeSut()
      const queue = { name: 'any_queue' }
      await sut.connect()
      sut.createQueue(queue)

      const result = await sut.subscribeToQueue(queue, () => right() as any)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when amqplib.connect throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockRejectedValueOnce(new Error())

      const result = await sut.connect()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left when connection.createChannel throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => { throw new Error() }
      } as any)

      const result = await sut.connect()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left when channel.assertQueue throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          assertQueue: () => { throw new Error() }
        })
      } as any)
      const queue = { name: 'any_queue' }
      await sut.connect()

      const result = sut.createQueue(queue)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left when channel.sendToQueue throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          sendToQueue: () => { throw new Error() }
        })
      } as any)
      const queue = { name: 'any_queue' }
      await sut.connect()

      const result = await sut.publishToQueue(queue, {
        aggregateId: 'any_id',
        createdAt: new Date(),
        payload: {
          anyKey: 'any_value'
        }
      } as any)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left when channel.sendToQueue returns false', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          sendToQueue: () => false
        })
      } as any)
      const queue = { name: 'any_queue' }
      await sut.connect()

      const result = await sut.publishToQueue(queue, {
        aggregateId: 'any_id',
        createdAt: new Date(),
        payload: {
          anyKey: 'any_value'
        }
      } as any)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left when channel.consume throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          consume: () => { throw new Error() }
        })
      } as any)
      const queue = { name: 'any_queue' }
      await sut.connect()

      const result = await sut.subscribeToQueue(queue, vi.fn())

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('does not call channel.ack when handlerFn returns Left', async () => {
      const { sut } = makeSut()
      const ackSpy = vi.fn()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          ack: ackSpy,
          consume: (queue, fn) => fn({
            content: Buffer.from(JSON.stringify({}))
          })
        })
      } as any)
      const queue = { name: 'any_queue' }
      await sut.connect()

      await sut.subscribeToQueue(queue, () => left(new Error()) as any)

      expect(ackSpy).not.toHaveBeenCalled()
    })
  })
})
