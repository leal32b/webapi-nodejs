export default interface LogErrorRepository {
  log: (stack: string) => Promise<void>
}
