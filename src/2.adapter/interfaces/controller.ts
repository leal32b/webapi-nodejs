import { HttpRequest, HttpResponse } from '@/2.adapter/types/http'

export default interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
