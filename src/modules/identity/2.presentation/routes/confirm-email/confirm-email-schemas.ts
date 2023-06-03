export const confirmEmailRequestSchema = {
  type: 'object',
  properties: {
    token: { type: 'string', pattern: '^[\\w-]+\\.[\\w-]+\\.[\\w-]+$' }
  },
  required: ['token'],
  additionalProperties: false
}

export const confirmEmailRequestSchemaExample = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.UnP25ddNPCSH2liwMMda7naPmIY0bOTXKoGWOpysVao'
}

export const confirmEmailResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' }
  },
  required: ['message'],
  additionalProperties: false
}

export const confirmEmailResponseSchemaExample = {
  message: 'email confirmed successfully'
}
