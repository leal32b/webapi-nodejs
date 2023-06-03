import amqplib from 'amqplib'

import { left, right } from '@/common/0.domain/utils/either'
import { type Logger } from '@/common/1.application/logging/logger'
import { ServerError } from '@/common/2.presentation/errors/server-error'
import { AmqplibAdapter } from '@/common/3.infra/events/amqplib/amqplib-adapter'

import { makeLoggerMock } from '~/common/_doubles/mocks/logger-mock'

vi.mock('amqplib', () => ({
  default: {
    connect: () => ({
      createChannel: () => ({
        ack: vi.fn(),
        assertExchange: vi.fn(),
        assertQueue: vi.fn(),
        bindQueue: vi.fn(),
        consume: (queue, fn) => fn({ content: Buffer.from(JSON.stringify({})) }),
        prefetch: vi.fn(),
        publish: () => true,
        sendToQueue: () => true
      })
    })
  }
}))

type SutTypes = {
  connectParams: Record<string, unknown>
  logger: Logger
  sut: AmqplibAdapter
}

const makeSut = (): SutTypes => {
  const params = {
    connectParams: {
      hostname: 'any_host',
      password: 'any_password',
      port: 0,
      protocol: 'any_protocol',
      username: 'any_user',
      vhost: 'any_vhost'
    },
    logger: makeLoggerMock()
  }
  const sut = AmqplibAdapter.create(params)

  return {
    ...params,
    sut
  }
}

describe('AmqplibAdapter', () => {
  describe('success', () => {
    it('calls amqplib.connect with correct params', async () => {
      const { sut } = makeSut()
      const connectSpy = vi.spyOn(amqplib, 'connect')

      await sut.connect()

      expect(connectSpy).toHaveBeenCalledWith({
        hostname: 'any_host',
        password: 'any_password',
        port: 0,
        protocol: 'any_protocol',
        username: 'any_user',
        vhost: 'any_vhost'
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
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
      await sut.connect()

      sut.createQueue(queue)

      expect(assertQueueSpy).toHaveBeenCalledWith('any_queue', expect.any(Object))
    })

    it('calls channel.bindQueue with correct params', async () => {
      const { sut } = makeSut()
      const bindQueueSpy = vi.fn()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          assertQueue: vi.fn(),
          bindQueue: bindQueueSpy
        })
      } as any)
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
      await sut.connect()

      sut.createQueue(queue)

      expect(bindQueueSpy).toHaveBeenCalledWith('any_queue', 'any_topic', 'any_key.#', expect.any(Object))
    })

    it('creates a queue', async () => {
      const { sut } = makeSut()
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
      await sut.connect()

      const result = sut.createQueue(queue)

      expect(result.isRight()).toBe(true)
    })

    it('calls channel.assertExchange with correct params', async () => {
      const { sut } = makeSut()
      const assertExchangeSpy = vi.fn()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          assertExchange: assertExchangeSpy
        })
      } as any)
      const topic = { name: 'any_topic' }
      await sut.connect()

      sut.createTopic(topic)

      expect(assertExchangeSpy).toHaveBeenCalledWith('any_topic', 'topic', expect.any(Object))
    })

    it('creates a topic', async () => {
      const { sut } = makeSut()
      const topic = { name: 'any_topic' }
      await sut.connect()

      const result = sut.createTopic(topic)

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
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
      const event = {
        aggregateId: 'any_id',
        createdAt: new Date(),
        payload: {
          anyKey: 'any_value'
        }
      }
      await sut.connect()

      await sut.publishToQueue(queue, event as any)

      expect(sendToQueueSpy).toHaveBeenCalledWith('any_queue', expect.any(Buffer), expect.any(Object))
    })

    it('publishes to queue', async () => {
      const { sut } = makeSut()
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
      const event = {
        aggregateId: 'any_id',
        createdAt: new Date(),
        payload: {
          anyKey: 'any_value'
        }
      }
      await sut.connect()
      sut.createQueue(queue)

      const result = await sut.publishToQueue(queue, event as any)

      expect(result.isRight()).toBe(true)
    })

    it('calls channel.publish with correct params', async () => {
      const { sut } = makeSut()
      const publishSpy = vi.fn()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          publish: publishSpy
        })
      } as any)
      const topic = { name: 'any_topic' }
      const key = ['any_key', '#']
      const event = {
        aggregateId: 'any_id',
        createdAt: new Date(),
        payload: {
          anyKey: 'any_value'
        }
      }
      await sut.connect()

      await sut.publishToTopic(topic, key, event as any)

      expect(publishSpy).toHaveBeenCalledWith('any_topic', 'any_key.#', expect.any(Buffer), expect.any(Object))
    })

    it('publishes to topic', async () => {
      const { sut } = makeSut()
      const topic = { name: 'any_topic' }
      const key = ['any_key', '#']
      const event = {
        aggregateId: 'any_id',
        createdAt: new Date(),
        payload: {
          anyKey: 'any_value'
        }
      }
      await sut.connect()
      sut.createTopic(topic)

      const result = await sut.publishToTopic(topic, key, event as any)

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
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
      await sut.connect()

      await sut.subscribeToQueue(queue, vi.fn())

      expect(consumeSpy).toHaveBeenCalledWith('any_queue', expect.any(Function), expect.any(Object))
    })

    it('subscribes to queue', async () => {
      const { sut } = makeSut()
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
      await sut.connect()
      sut.createQueue(queue)

      const result = await sut.subscribeToQueue(queue, () => right() as any)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left with ServerError when amqplib.connect throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockRejectedValueOnce(new Error())

      const result = await sut.connect()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when connection.createChannel throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => { throw new Error() }
      } as any)

      const result = await sut.connect()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when channel.assertQueue throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          assertQueue: () => { throw new Error() }
        })
      } as any)
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
      await sut.connect()

      const result = sut.createQueue(queue)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when channel.bindQueue throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          bindQueue: () => { throw new Error() }
        })
      } as any)
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
      await sut.connect()

      const result = sut.createQueue(queue)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when channel.assertExchange throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          assertExchange: () => { throw new Error() }
        })
      } as any)
      const topic = { name: 'any_topic' }
      await sut.connect()

      const result = sut.createTopic(topic)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when channel.sendToQueue throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          sendToQueue: () => { throw new Error() }
        })
      } as any)
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
      const event = {
        aggregateId: 'any_id',
        createdAt: new Date(),
        payload: {
          anyKey: 'any_value'
        }
      }
      await sut.connect()

      const result = await sut.publishToQueue(queue, event as any)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when channel.publish throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          publish: () => { throw new Error() }
        })
      } as any)
      const topic = { name: 'any_topic' }
      const key = ['any_key', '#']
      const event = {
        aggregateId: 'any_id',
        createdAt: new Date(),
        payload: {
          anyKey: 'any_value'
        }
      }
      await sut.connect()

      const result = await sut.publishToTopic(topic, key, event as any)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when channel.sendToQueue returns false', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          sendToQueue: () => false
        })
      } as any)
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
      const event = {
        aggregateId: 'any_id',
        createdAt: new Date(),
        payload: {
          anyKey: 'any_value'
        }
      }
      await sut.connect()

      const result = await sut.publishToQueue(queue, event as any)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when channel.consume throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => ({
          consume: () => { throw new Error() }
        })
      } as any)
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
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
      const topic = { name: 'any_topic' }
      const queue = { key: ['any_key', '#'], name: 'any_queue', topics: [topic] }
      await sut.connect()

      await sut.subscribeToQueue(queue, () => left(new Error()) as any)

      expect(ackSpy).not.toHaveBeenCalled()
    })
  })
})
