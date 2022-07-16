
## Entity: User
- [x] id
- [x] email
- [x] name
- [x] password
- [ ] emailConfirmed
- [ ] createdAt
- [ ] updatedAt
- [ ] token
- [ ] active

## DTO
- email
- name
- password
- passwordRetype

## Success
1. [ ] Receives a POST requisition at route `/api/user/sign-up`
2. [x] Validates that `email` is not in use
3. [x] Validates that `password` and `passwordRetype` are equal
4. [x] Generates a `hashedPassword`
5. [x] Generates a `token` for e-mail confirmation
6. [x] Creates an `User`
7. [ ] Sends an e-mail for confirmation
8. [x] Return 200 with created user `email`

## Failure
1. [ ] Returns 404 when the API does not exist
2. [ ] Returns 400 when there is any missing field
3. [ ] Returns 400 when `password` and `passwordRetype` do not match
4. [ ] Returns 400 when `email` is invalid
5. [ ] Returns 403 when `email` is already in use
6. [ ] Returns 500 when an error occur generating a `hashedPassword`
7. [ ] Returns 500 when an error occur creating a `User`
8. [ ] Returns 500 when an error occur sending a confirmation e-mail
