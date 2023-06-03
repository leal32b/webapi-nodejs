type Schema = {
  $ref?: string
  type?: string
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

type Parameter = {
  example: string
  in: string
  name: string
  required: boolean
  schema: Schema
}

type Security = Record<string, any>

export type Path = Record<string, {
  tags: string[]
  summary: string
  security?: Security[]
  parameters?: Parameter[]
  requestBody?: {
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
}

export interface ApiDocumenter {
  config: Record<string, unknown>
}
