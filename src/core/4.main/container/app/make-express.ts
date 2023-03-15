import { getVar } from '@/core/0.domain/utils/var'
import { type WebApp } from '@/core/3.infra/api/app/web-app'
import { ExpressAdapter } from '@/core/3.infra/webapp/express/express-adapter'

const port = parseInt(getVar('PORT'))

export const makeExpress: WebApp = ExpressAdapter.create(port)
