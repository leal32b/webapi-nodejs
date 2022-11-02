export const emailTakenSchema = {
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

export const emailTakenSchemaExample = {
  error: {
    field: 'email',
    input: 'john.doe@mail.com',
    message: 'email already in use'
  }
}
