import { Path } from '@/core/3.infra/documentation/api-specification/path'
import { invalidPasswordSchemaExample } from '@/core/3.infra/documentation/api-specification/schemas/invalid-password-schema'
import { invalidSchemaSchemaExample } from '@/core/3.infra/documentation/api-specification/schemas/invalid-schema-schema'
import { notFoundSchemaExample } from '@/core/3.infra/documentation/api-specification/schemas/not-found-schema'
import { signInRequestSchemaExample, signInResponseSchemaExample } from '@/user/3.infra/api/routes/sign-in/sign-in-schemas'

export const signInPath: Path = {
  post: {
    tags: ['user'],
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
