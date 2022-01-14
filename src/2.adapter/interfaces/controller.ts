import { HttpRequest, HttpResponse } from '@/2.adapter/types/http-types'

export default interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
