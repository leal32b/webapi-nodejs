export class ServerError extends Error {
  constructor (stack?: string) {
    super('Internal Server error')
    this.name = 'ServerError'

    if (stack) {
      this.stack = stack
    }
  }
}
