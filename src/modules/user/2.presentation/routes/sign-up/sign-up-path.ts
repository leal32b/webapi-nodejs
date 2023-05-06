import { type Path } from '@/core/2.presentation/documentation/api-documenter'
import { emailTakenSchemaExample } from '@/core/2.presentation/documentation/schemas/email-taken-schema'
import { invalidSchemaSchemaExample } from '@/core/2.presentation/documentation/schemas/invalid-schema-schema'
import { passwordMismatchSchemaExample } from '@/core/2.presentation/documentation/schemas/password-mismatch-schema'
import { signUpRequestSchemaExample, signUpResponseSchemaExample } from '@/user/2.presentation/routes/sign-up/sign-up-schemas'

export const signUpPath: Path = {
  post: {
    tags: ['user'],
    summary: 'Signs up a new user',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUpRequestSchema'
          },
          example: signUpRequestSchemaExample
        }
      }
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/signUpResponseSchema'
            },
            example: signUpResponseSchemaExample
          }
        }
      },
      400: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              oneOf: [{
                $ref: '#/schemas/emailTakenSchema'
              }, {
                $ref: '#/schemas/passwordMismatchSchema'
              }]
            },
            examples: {
              emailTakenSchema: {
                value: emailTakenSchemaExample
              },
              passwordMismatchSchema: {
                value: passwordMismatchSchemaExample
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
