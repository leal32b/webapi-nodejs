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

export type Path = {
  [index: string]: {
    [index: string]: {
      tags: string[]
      summary: string
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
}
