export const passwordMismatchSchema = {
  type: 'object',
  properties: {
    error: {
      type: 'object',
      properties: {
        field: {
          type: 'string'
        },
        message: {
          type: 'string'
        }
      },
      required: ['field', 'message'],
      additionalProperties: false
    }
  },
  required: ['error'],
  additionalProperties: false
}

export const passwordMismatchSchemaExample = {
  error: {
    field: 'password',
    message: 'passwords should match'
  }
}
