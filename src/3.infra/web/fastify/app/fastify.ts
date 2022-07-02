import fastify, { FastifyInstance } from 'fastify'

import { Route } from '@/2.presentation/types/route'
import App from '@/3.infra/interfaces/web-app'
import { adaptFastifyRoute } from '@/3.infra/web/fastify/adapters/fastify-route'

export default class FastifyApp implements App {
  private readonly app: FastifyInstance

  constructor () {
    this.app = fastify()
  }

  setRoute (route: Route): void {
    const { type, path, controller } = route

    this.app[type](path, adaptFastifyRoute(controller))
  }

  listen (port: number, callback = null): void {
    this.app.listen({ port, host: '0.0.0.0' }, callback)
  }
}
