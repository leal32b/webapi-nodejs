import { Controller } from '@/2.adapter/interfaces/controller'
import { HttpRequest } from '@/2.adapter/interfaces/http'
import { Request, Response } from 'express'

export const adaptExpressRoute = (controller: Controller): Function => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: req.body
    }

    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
