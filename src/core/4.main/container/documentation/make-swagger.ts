import { type ApiDocumenter } from '@/core/2.presentation/documentation/api-documenter'
import { SwaggerAdapter } from '@/core/3.infra/documentation/swagger/swagger-adapter'
import { apiDocumentationParams } from '@/core/4.main/container/documentation/api-documentation-params'

export const makeSwagger: ApiDocumenter = SwaggerAdapter.create({
  openapi: '3.0.0',
  components: {
    securitySchemes: {
      accessToken: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  ...apiDocumentationParams
})
