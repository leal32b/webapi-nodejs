import { type Path } from '@/common/2.presentation/documentation/api-documenter'
import { invalidSchemaSchemaExample } from '@/common/2.presentation/documentation/schemas/invalid-schema.schema'
import { nameTakenSchemaExample } from '@/common/2.presentation/documentation/schemas/name-taken.schema'

import { createGroupRequestSchemaExample, createGroupResponseSchemaExample } from '@/identity/2.presentation/routes/group/create-group/create-group.schemas'

export const createGroupPath: Path = {
  post: {
    tags: ['identity'],
    summary: 'Creates a new user group',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/createGroupRequestSchema'
          },
          example: createGroupRequestSchemaExample
        }
      }
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/createGroupResponseSchema'
            },
            example: createGroupResponseSchemaExample
          }
        }
      },
      400: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              oneOf: [{
                $ref: '#/schemas/nameTakenSchema'
              }]
            },
            examples: {
              nameTakenSchema: {
                value: nameTakenSchemaExample
              }
            }
          }
        }
      },
      422: {
        description: 'Unprocessable Entity',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/invalidSchemaSchema'
            },
            example: invalidSchemaSchemaExample
          }
        }
      }
    }
  }
}
