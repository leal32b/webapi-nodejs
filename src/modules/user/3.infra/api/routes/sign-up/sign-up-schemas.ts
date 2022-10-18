export const signUpRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    passwordRetype: { type: 'string' }
  },
  required: ['name', 'email', 'password', 'passwordRetype'],
  additionalProperties: false
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
