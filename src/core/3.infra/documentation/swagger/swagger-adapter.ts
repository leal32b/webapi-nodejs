import { type ApiDocumentationParams, type ApiDocumenter } from '@/core/3.infra/documentation/api-documenter'

type SwaggerConfig = {
  components: {
    securitySchemes: {
      accessToken: {
        bearerFormat: string
        scheme: string
        type: string
      }
    }
  }
  openapi: string
}

type Props = ApiDocumentationParams & SwaggerConfig

export class SwaggerAdapter implements ApiDocumenter {
  private constructor (private readonly props: Props) {}

  public static create (props: Props): SwaggerAdapter {
    return new SwaggerAdapter(props)
  }

  public get config (): Record<string, unknown> {
    return this.props
  }
}
