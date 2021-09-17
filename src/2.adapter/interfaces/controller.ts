import { HttpRequest, HttpResponse } from '@/2.adapter/interfaces/http'

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
