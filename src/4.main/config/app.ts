import setupMiddlewares from '@/4.main/config/setup-middlewares'
import express from 'express'

const app = express()
setupMiddlewares(app)

export default app
