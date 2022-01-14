import { HttpRequest, HttpResponse } from '@/2.presentation/types/http-types'

export default interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
