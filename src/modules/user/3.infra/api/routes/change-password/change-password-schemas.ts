export const changePasswordRequestSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    password: { type: 'string' },
    passwordRetype: { type: 'string' }
  },
  required: ['id', 'password', 'passwordRetype'],
  additionalProperties: false
}

export const changePasswordRequestSchemaExample = {
  id: '01ab23cd45ef01ab23cd45ef',
  password: 'abc123',
  passwordRetype: 'abc123'
}

export const changePasswordResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' }
  },
  required: ['message'],
  additionalProperties: false
}

export const changePasswordResponseSchemaExample = {
  message: 'password updated successfully'
}
