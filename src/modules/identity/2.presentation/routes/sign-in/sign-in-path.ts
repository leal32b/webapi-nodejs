import { type Path } from '@/common/2.presentation/documentation/api-documenter'
import { invalidPasswordSchemaExample } from '@/common/2.presentation/documentation/schemas/invalid-password-schema'
import { invalidSchemaSchemaExample } from '@/common/2.presentation/documentation/schemas/invalid-schema-schema'
import { notFoundSchemaExample } from '@/common/2.presentation/documentation/schemas/not-found-schema'

import { signInRequestSchemaExample, signInResponseSchemaExample } from '@/identity/2.presentation/routes/sign-in/sign-in-schemas'

export const signInPath: Path = {
  post: {
    tags: ['identity'],
    summary: 'Signs in an user',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signInRequestSchema'
          },
          example: signInRequestSchemaExample
        }
      }
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/signInResponseSchema'
            },
            example: signInResponseSchemaExample
          }
        }
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              oneOf: [{
                $ref: '#/schemas/invalidPasswordSchema'
              }, {
                $ref: '#/schemas/notFoundSchema'
              }]
            },
            examples: {
              invalidPasswordSchema: {
                value: invalidPasswordSchemaExample
              },
              notFoundSchema: {
                value: notFoundSchemaExample
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
