import { Path } from '@/core/3.infra/api/api-specification/path'

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
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/signUpResponseSchema'
            }
          }
        }
      }
    }
  }
}
