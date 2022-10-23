export const missingTokenSchema = {
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

export const missingTokenSchemaExample = {
  error: {
    message: 'no Authorization token was provided'
  }
}
