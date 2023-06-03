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

export const emailNotFoundSchemaExample = {
  error: {
    field: 'email',
    input: 'john.doe@mail.com',
    message: "email 'john.doe@mail.com' not found"
  }
}

export const tokenNotFoundSchemaExample = {
  error: {
    field: 'token',
    input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.UnP25ddNPCSH2liwMMda7naPmIY0bOTXKoGWOpysVao',
    message: "token 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.UnP25ddNPCSH2liwMMda7naPmIY0bOTXKoGWOpysVao' not found"
  }
}
