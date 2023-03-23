import amqplib from 'amqplib'

import { RabbitmqAdapter } from '@/core/3.infra/events/rabbitmq/rabbitmq-adapter'

vi.mock('amqplib', () => ({
  default: {
    connect: () => ({
      createChannel: () => {
        return { assertQueue: vi.fn() }
      }
    })
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

      await sut.connect()

      expect(connectSpy).toHaveBeenCalledWith('any_host')
    })

    it('connects to rabbitmq server', async () => {
      const { sut } = makeSut()

      const result = await sut.connect()

      expect(result.isRight()).toBe(true)
    })

    it('calls amqplib.createChannel with correct params', async () => {
      const { sut } = makeSut()
      const createChannelSpy = vi.fn()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({ createChannel: createChannelSpy } as any)

      await sut.connect()

      expect(createChannelSpy).toHaveBeenCalledOnce()
    })

    it('calls amqplib.assertQueue with correct params', async () => {
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
  })

  describe('failure', () => {
    it('returns Left when amqplib.connect throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockRejectedValueOnce(new Error())

      const result = await sut.connect()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when amqplib.createChannel throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(amqplib, 'connect').mockResolvedValueOnce({
        createChannel: () => { throw new Error() }
      } as any)

      const result = await sut.connect()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when amqplib.assertQueue throws', async () => {
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
    })
  })
})
