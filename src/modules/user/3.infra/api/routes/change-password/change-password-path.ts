import { Path } from '@/core/3.infra/documentation/api-specification/path'
import { invalidSchemaSchemaExample } from '@/core/3.infra/documentation/api-specification/schemas/invalid-schema-schema'
import { invalidTokenSchemaExample } from '@/core/3.infra/documentation/api-specification/schemas/invalid-token-schema'
import { missingTokenSchemaExample } from '@/core/3.infra/documentation/api-specification/schemas/missing-token-schema'
import { passwordMismatchSchemaExample } from '@/core/3.infra/documentation/api-specification/schemas/password-mismatch-schema'
import { changePasswordRequestSchemaExample, changePasswordResponseSchemaExample } from '@/user/3.infra/api/routes/change-password/change-password-schemas'

export const changePasswordPath: Path = {
  post: {
    tags: ['user'],
    summary: "Changes a user's password",
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
