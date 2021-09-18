import setupMiddlewares from '@/4.main/config/middlewares'
import setupRoutes from '@/4.main/config/routes'
import express from 'express'

const app = express()
setupMiddlewares(app)
setupRoutes(app)

export default app
