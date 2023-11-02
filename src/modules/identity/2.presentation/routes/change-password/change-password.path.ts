import { type Path } from '@/common/2.presentation/documentation/api-documenter'
import { invalidSchemaSchemaExample } from '@/common/2.presentation/documentation/schemas/invalid-schema.schema'
import { invalidTokenSchemaExample } from '@/common/2.presentation/documentation/schemas/invalid-token.schema'
import { missingTokenSchemaExample } from '@/common/2.presentation/documentation/schemas/missing-token.schema'
import { passwordMismatchSchemaExample } from '@/common/2.presentation/documentation/schemas/password-mismatch.schema'

import { changePasswordRequestSchemaExample, changePasswordResponseSchemaExample } from '@/identity/2.presentation/routes/change-password/change-password.schemas'

export const changePasswordPath: Path = {
  post: {
    tags: ['identity'],
    summary: "Changes an user's password",
    security: [{
      accessToken: []
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/changePasswordRequestSchema'
          },
          example: changePasswordRequestSchemaExample
        }
      }
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/changePasswordResponseSchema'
            },
            example: changePasswordResponseSchemaExample
          }
        }
      },
      400: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/passwordMismatchSchema'
            },
            example: passwordMismatchSchemaExample
          }
        }
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              oneOf: [{
                $ref: '#/schemas/invalidTokenSchema'
              }, {
                $ref: '#/schemas/missingTokenSchema'
              }]
            },
            examples: {
              invalidPasswordSchema: {
                value: invalidTokenSchemaExample
              },
              notFoundSchema: {
                value: missingTokenSchemaExample
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
