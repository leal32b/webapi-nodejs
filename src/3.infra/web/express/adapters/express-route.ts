import { Request, Response, RequestHandler } from 'express'

import Controller from '@/2.presentation/base/controller'
import { HttpRequest } from '@/2.presentation/types/http-request'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: HttpRequest<any> = {
      body: req.body
    }

    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
