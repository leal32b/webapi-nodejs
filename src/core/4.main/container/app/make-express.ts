import { type WebApp } from '@/core/3.infra/api/app/web-app'
import { ExpressAdapter } from '@/core/3.infra/webapp/express/express-adapter'

export const makeExpress: WebApp = new ExpressAdapter()
