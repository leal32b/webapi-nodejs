export const invalidTokenSchema = {
  type: 'object',
  properties: {
    error: {
      type: 'object',
      properties: {
        message: {
          type: 'string'
        }
      },
      required: ['message'],
      additionalProperties: false
    }
  },
  required: ['error'],
  additionalProperties: false
}

export const invalidTokenSchemaExample = {
  error: {
    message: 'token is invalid (type: Bearer)'
  }
}
