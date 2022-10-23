type Schema = {
  $ref: string
}

type Schemas = {
  oneOf: Schema[]
}

type Example = {
  [key: string]: any
}

type Examples = {
  [key: string]: {
    value: Example
  }
}

type Content = {
  [key: string]: {
    schema: Schema | Schemas
    example?: Example
    examples?: Examples
  }
}

type Security = {
  [key: string]: any
}

export type Path = {
  [index: string]: {
    tags: string[]
    summary: string
    security?: Security[]
    requestBody: {
      required: boolean
      content: Content
    }
    responses: {
      [key: number]: {
        description: string
        content: Content
      }
    }
  }
}
