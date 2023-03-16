export const signUpRequestSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    language: { type: 'string' },
    name: { type: 'string' },
    password: { type: 'string' },
    passwordRetype: { type: 'string' }
  },
  required: ['email', 'language', 'name', 'password', 'passwordRetype'],
  additionalProperties: false
}

export const signUpRequestSchemaExample = {
  email: 'john.doe@mail.com',
  language: 'en',
  name: 'John',
  password: 'abc123',
  passwordRetype: 'abc123'
}

export const signUpResponseSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    message: { type: 'string' }
  },
  required: ['email', 'message'],
  additionalProperties: false
}

export const signUpResponseSchemaExample = {
  email: 'john.doe@mail.com',
  message: 'user created successfully'
}
