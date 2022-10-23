export const invalidPasswordSchema = {
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

export const invalidPasswordSchemaExample = {
  error: {
    message: 'invalid username or password'
  }
}
