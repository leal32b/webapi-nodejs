type Schema = {
  $ref: string
}

type Schemas = {
  oneOf: Schema[]
}

type Example = Record<string, any>

type Examples = Record<string, {
  value: Example
}>

type Content = Record<string, {
  schema: Schema | Schemas
  example?: Example
  examples?: Examples
}>

type Security = Record<string, any>

export type Path = Record<string, {
  tags: string[]
  summary: string
  security?: Security[]
  requestBody: {
    required: boolean
    content: Content
  }
  responses: Record<number, {
    description: string
    content: Content
  }>
}>

type Info = {
  description: string
  title: string
  version: string
}

type Server = {
  url: string
  description: string
}

export type ApiDocumentationParams = {
  info: Info
  paths: Record<string, Path>
  schemas: Record<string, unknown>
  servers: Server[]
  tags: Array<{ name: string }>
}

export interface ApiDocumenter {
  config: Record<string, unknown>
}
