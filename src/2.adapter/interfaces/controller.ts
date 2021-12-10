import { HttpRequest, HttpResponse } from '@/2.adapter/types/http'

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
