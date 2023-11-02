export const signInRequestSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: [
    'email',
    'password'
  ],
  additionalProperties: false
}

export const signInRequestSchemaExample = {
  email: 'john.doe@mail.com',
  password: 'abc123'
}

export const signInResponseSchema = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
    message: { type: 'string' }
  },
  required: [
    'accessToken',
    'message'
  ],
  additionalProperties: false
}

export const signInResponseSchemaExample = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U',
  message: 'user signed in successfully'
}
