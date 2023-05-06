import { getIntVar } from '@/core/0.domain/utils/var'
import { ExpressAdapter } from '@/core/3.infra/webapp/express/express-adapter'
import { type WebApp } from '@/core/3.infra/webapp/web-app'
import { logging } from '@/core/4.main/container/logging'

const port = getIntVar('PORT')

export const makeExpress: WebApp = ExpressAdapter.create({
  logger: logging.logger,
  port
})
