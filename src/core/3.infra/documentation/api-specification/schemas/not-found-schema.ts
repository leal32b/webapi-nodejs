export const notFoundSchema = {
  type: 'object',
  properties: {
    error: {
      type: 'object',
      properties: {
        input: {
          type: 'string'
        },
        field: {
          type: 'string'
        },
        message: {
          type: 'string'
        }
      },
      required: ['input', 'field', 'message'],
      additionalProperties: false
    }
  },
  required: ['error'],
  additionalProperties: false
}

export const notFoundSchemaExample = {
  error: {
    field: 'email',
    input: 'john.doe@mail.com',
    message: "email 'john.doe@mail.com' not found"
  }
}
