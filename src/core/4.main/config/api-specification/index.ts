import { makeSwagger } from '@/core/4.main/config/api-specification/make-swagger'

type ApiSpecification = {
  path: string
  middlewares: any[]
}

export const apiSpecification: ApiSpecification = {
  path: makeSwagger.path,
  middlewares: makeSwagger.middlewares
}
