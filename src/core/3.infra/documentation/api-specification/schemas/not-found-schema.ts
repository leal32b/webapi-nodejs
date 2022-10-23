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
    input: 'john.doe@mail.com',
    field: 'email',
    message: "email 'john.doe@mail.com' not found"
  }
}
