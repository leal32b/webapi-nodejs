export const invalidSchemaSchema = {
  type: 'object',
  properties: {
    error: {
      type: 'object',
      properties: {
        instancePath: {
          type: 'string'
        },
        keyword: {
          type: 'string'
        },
        message: {
          type: 'string'
        },
        params: {
          type: 'object',
          properties: {
            missingProperty: {
              type: 'string'
            }
          },
          required: ['missingProperty'],
          additionalProperties: false
        },
        schemaPath: {
          type: 'string'
        }
      },
      required: ['instancePath', 'keyword', 'message', 'params', 'schemaPath'],
      additionalProperties: false
    }
  },
  required: ['error'],
  additionalProperties: false
}

export const invalidSchemaSchemaExample = {
  error: {
    instancePath: '',
    keyword: 'required',
    message: "must have required property 'email'",
    params: {
      missingProperty: 'email'
    },
    schemaPath: '#/required'
  }
}
