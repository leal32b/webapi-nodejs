export const createGroupRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' }
  },
  required: [
    'name'
  ],
  additionalProperties: false
}

export const createGroupRequestSchemaExample = {
  name: 'User'
}

export const createGroupResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    name: { type: 'string' }
  },
  required: [
    'name',
    'message'
  ],
  additionalProperties: false
}

export const createGroupResponseSchemaExample = {
  message: 'group created successfully',
  name: 'User'
}
