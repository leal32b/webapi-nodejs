# Files conventions

## 0.domain

## entities
- `user.ts`
- ```typescript
  export default class User {
    constructor (readonly props: {
      readonly id: string
      readonly name: string
    }) {}
  }
  ```

## types
- `user-types.ts`
- ```typescript
  export type UserData = {
    name: string
  }
  ```

## interfaces
(usecases to be implemented in 1.application layer)
- `create-user.ts`
- ```typescript
  import User from '@/0.domain/entities/user'
  import { UserData } from '@/0.domain/types/user'
  
  export default interface CreateUser {
    create: (userData: UserData) => Promise<User>
  }
  ```

## tests
## mocks
(classes)
- `create-user-usecase.mock.ts`
- ```typescript
  import User from '@/0.domain/entities/user'
  import Usecase from '@/1.application/interfaces/usecase'

  export const makeCreateUserUsecaseStub = (): Usecase<null, User> => {
    class CreateUserUsecaseStub implements Usecase<null, User> {
      async execute (): Promise<User> {
        const fakeUser = new User({
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email@mail.com',
          password: 'valid_password'
        })

        return await Promise.resolve(fakeUser)
      }
    }

    return new CreateUserUsecaseStub()
  }
```