import { getIntVar } from '@/common/0.domain/utils/var'
import { ExpressAdapter } from '@/common/3.infra/webapp/express/express.adapter'
import { type WebApp } from '@/common/3.infra/webapp/web-app'
import { logging } from '@/common/4.main/container/logging'

const port = getIntVar('PORT')

export const makeExpress: WebApp = ExpressAdapter.create({
  logger: logging.logger,
  port
})
