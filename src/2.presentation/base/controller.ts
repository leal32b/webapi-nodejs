import { HttpRequest } from '@/2.presentation/types/http-request'
import { HttpResponse } from '@/2.presentation/types/http-response'

export default abstract class Controller {
  abstract handle (httpRequest: HttpRequest<any>): Promise<HttpResponse>
}
