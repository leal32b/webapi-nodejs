export interface Logger {
  error: (label: string, message: string | Record<string, unknown> | any[]) => void
  info: (label: string, message: string | Record<string, unknown> | any[]) => void
}
