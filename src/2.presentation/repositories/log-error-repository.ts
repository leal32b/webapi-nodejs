export default interface LogErrorRepository {
  log: (error: string) => Promise<void>
}
