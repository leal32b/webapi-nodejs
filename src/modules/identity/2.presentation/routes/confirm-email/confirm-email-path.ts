import { type Path } from '@/common/2.presentation/documentation/api-documenter'
import { invalidSchemaSchemaExample } from '@/common/2.presentation/documentation/schemas/invalid-schema-schema'
import { tokenNotFoundSchemaExample } from '@/common/2.presentation/documentation/schemas/not-found-schema'

import { confirmEmailRequestSchemaExample, confirmEmailResponseSchemaExample } from '@/identity/2.presentation/routes/confirm-email/confirm-email-schemas'

export const confirmEmailPath: Path = {
  patch: {
    tags: ['identity'],
    summary: "Confirms an user's e-mail",
    parameters: [{
      in: 'path',
      name: 'token',
      required: true,
      schema: { type: 'string' },
      example: confirmEmailRequestSchemaExample.token
    }],
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/confirmEmailResponseSchema'
            },
            example: confirmEmailResponseSchemaExample
          }
        }
      },
      400: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              oneOf: [{
                $ref: '#/schemas/notFoundSchema'
              }]
            },
            examples: {
              notFoundSchema: {
                value: tokenNotFoundSchemaExample
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
