import { type Path } from '@/core/3.infra/documentation/path'

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
