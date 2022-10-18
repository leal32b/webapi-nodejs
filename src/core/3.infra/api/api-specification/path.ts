type Content = {
  [key: string]: {
    schema: {
      $ref: string
    }
  }
}

export type Path = {
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
